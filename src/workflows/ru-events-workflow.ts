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
            const e = findEvent(event, t.events);
            if (e) {
              continue;
            } else {
              try {
                await t.workflow.signal.publishEvent(event);
                t.events.push(event);
              } catch (err) {
                console.error(err);
                throw err;
              }
            }
          } else {
            const workflowId = convertToId(event.title);
            const publishTour = createChildWorkflowHandle(publishTourWorkflow, {
              workflowId,
            });
            const keywords = event.title.split(" ");
            await publishTour.start(event);
            const tour: Tour = {
              keywords: keywords,
              workflow: publishTour,
              events: [event],
            };
            tours.push(tour);
          }
        }

        await sleep(100);
      }
    },
  };
};

function findTourByEvent(event: Event, tours: Tour[]): Tour | null {
  for (const t of tours) {
    const same = t.events.some((e) => isSameTour(e.title, event.title));
    if (same) {
      return t;
    }
  }

  return null;
}

function findEvent(event: Event, events: Event[]): Event | null {
  events = events.filter(
    (e) =>
      e.publisher === event.publisher &&
      e.date === event.date &&
      e.city == event.city
  );

  if (events.length > 1) {
    throw new Error(
      `found ${events.length} events with the same params: ${event.publisher} ${event.date} ${event.city}`
    );
  }

  if (events.length == 1) {
    return events[0];
  }

  return null;
}

function convertToId(title: string): string {
  return cleanText(title).replace(/\s+/g, "-").substr(0, 64);
}
