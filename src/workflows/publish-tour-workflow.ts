import { PublishTourWorkflow } from "../interfaces/workflows";
import { createActivityHandle } from "@temporalio/workflow";
import * as activities from "../activities";
import { Event } from "../models";
import { sleep } from "../features";

/** Workflow that publishes and tracks a tour of events */
export const publishTourWorkflow: PublishTourWorkflow = (event: Event) => {
  const events: Event[] = [event];

  return {
    async execute(): Promise<void> {
      await sleep(1000);
      return;
    },
    signals: {
      publishEvent: (event: Event) => {
        events.push(event);
      },
    },
  };
};
