import {
  createActivityHandle,
  createChildWorkflowHandle,
} from "@temporalio/workflow";
import { RuEventsWorkflow } from "../interfaces/workflows";
import * as activities from "../activities";
import { Event, Tour } from "../models";
import { publishTourWorkflow } from "./publish-tour-workflow";

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
              // TODO signal the tour's workflow about the new event
            }
          } else {
            const publishTour = createChildWorkflowHandle(publishTourWorkflow);
            const keywords = event.title.split(" ");
            await publishTour.execute(keywords);
          }
        }

        await sleep(100);
      }
    },
  };
};

function findTourByEvent(event: Event, tours: Tour[]): Tour | null {
  for (const t of tours) {
    for (const e of t.events) {
      if (
        e.title === event.title &&
        e.date === event.date &&
        e.city === event.city
      ) {
        return t;
      }
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

async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
