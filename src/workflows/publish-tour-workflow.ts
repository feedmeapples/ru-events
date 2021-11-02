import { PublishTourWorkflow } from "../interfaces/workflows";
import { createActivityHandle } from "@temporalio/workflow";
import * as activities from "../activities";
import { Event } from "../models";
import { sleep } from "../features/sleep";

interface TelegramEvent extends Event {
  isPublished?: boolean;
}

const { sendTelegramMessage } = createActivityHandle<typeof activities>({
  startToCloseTimeout: "1 minutes",
});

/** Workflow that publishes and tracks a tour of events */
export const publishTourWorkflow: PublishTourWorkflow = (event: Event) => {
  const events: TelegramEvent[] = [event];

  return {
    async execute(): Promise<void> {
      let expired = false;
      while (!expired) {
        for (let event of events) {
          if (event.isPublished) {
            continue;
          }

          await sendTelegramMessage(event);
          event.isPublished = true;
        }

        sleep(1000);
      }
      expired = events.every((e) => new Date(e.date) >= new Date());
    },
    signals: {
      publishEvent: (event: Event) => {
        events.push(event);
      },
    },
  };
};
