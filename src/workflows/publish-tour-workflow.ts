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
  retry: {
    initialInterval: "1m",
    maximumAttempts: 10,
  },
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

        expired = events.every((e) => new Date(e.date) < new Date());
        sleep(10);
      }
    },
    signals: {
      publishEvent: (event: Event) => {
        const e = findEvent(event, events);
        if (!e) {
          events.push(event);
        }
      },
    },
  };
};

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
