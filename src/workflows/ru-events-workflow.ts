import {
  proxyActivities,
  startChild,
  getExternalWorkflowHandle,
} from "@temporalio/workflow";

import { Event, Tour } from "../models";
import * as activities from "../activities";
import {
  publishEventSignal,
  publishTourWorkflow,
} from "./publish-tour-workflow";
import { sleep } from "../features/sleep";
import { isSameTour, cleanText } from "../features/similarity";
import { randString } from "../features/randString";

const { fetchEvents } = proxyActivities<typeof activities>({
  startToCloseTimeout: "30 minutes",
});

const tours: Tour[] = [];

export async function ruEventsWorkflow(): Promise<void> {
  while (true) {
    const events = await fetchEvents();

    for (const event of events) {
      const t = findTourByEvent(event, tours);
      if (t) {
        try {
          const wf = getExternalWorkflowHandle(t.workflow.id);

          await wf.signal(publishEventSignal, event);
        } catch (err) {
          console.error(err);
        }
      } else {
        const workflowId = `${convertToId(event.title)}-${randString(4)}`;
        const run = await startChild(publishTourWorkflow, {
          workflowId,
          args: [event],
        });
        const tour: Tour = {
          keywords: event.title,
          workflow: { id: workflowId, runId: run.originalRunId },
        };
        tours.push(tour);
      }
    }

    await sleep(100);
  }
}

function findTourByEvent(event: Event, tours: Tour[]) {
  return tours.find((t) => isSameTour(t.keywords, event.title));
}

function convertToId(title: string): string {
  return cleanText(title).replace(/\s+/g, "-").substr(0, 64);
}
