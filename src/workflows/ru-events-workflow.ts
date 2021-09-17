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

  const findTourByEvent = (event: Event) => {
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

    return undefined;
  };

  return {
    async execute(): Promise<void> {
      while (true) {
        const events = await fetchEvents();

        for (const event of events) {
          const tour = findTourByEvent(event);
          if (tour) {
            // TODO signal the tour's workflow about the new event
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

async function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
