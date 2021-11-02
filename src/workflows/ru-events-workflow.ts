import {
  createActivityHandle,
  createChildWorkflowHandle,
} from "@temporalio/workflow";

import { Event, Tour } from "../models";
import * as activities from "../activities";
import { RuEventsWorkflow } from "../interfaces/workflows";
import { publishTourWorkflow } from "./publish-tour-workflow";
import { sleep } from "../features/sleep";
import { isSameTour, cleanText } from "../features/similarity";
import { randString } from "../features/randString";

const { fetchEvents } = createActivityHandle<typeof activities>({
  startToCloseTimeout: "30 minutes",
});

export const ruEventsWorkflow: RuEventsWorkflow = () => {
  const tours: Tour[] = [];

  return {
    async execute(): Promise<void> {
      while (true) {
        const events = await fetchEvents();

        for (const event of events) {
          const t = findTourByEvent(event, tours);
          if (t) {
            try {
              await t.workflow.signal.publishEvent(event);
            } catch (err) {
              console.error(err);
            }
          } else {
            const workflowId = `${convertToId(event.title)}-${randString(4)}`;
            const publishTour = createChildWorkflowHandle(publishTourWorkflow, {
              workflowId,
            });
            await publishTour.start(event);
            const tour: Tour = {
              keywords: event.title,
              workflow: publishTour,
            };
            tours.push(tour);
          }
        }

        await sleep(100);
      }
    },
  };
};

function findTourByEvent(event: Event, tours: Tour[]) {
  return tours.find((t) => isSameTour(t.keywords, event.title));
}

function convertToId(title: string): string {
  return cleanText(title).replace(/\s+/g, "-").substr(0, 64);
}
