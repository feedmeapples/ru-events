import * as wf from "@temporalio/workflow";

import * as activities from "../activities";
import { Event } from "../models";
import { sleep } from "../features/sleep";
import { validateEvent } from "../features/scrapers/utils";

interface TelegramEvent extends Event {
  isPublished?: boolean;
}

export const publishEventSignal = wf.defineSignal<[Event]>("publishEvent");

const { sendTelegramMessage } = wf.proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "1 minutes",
  retry: {
    initialInterval: "1m",
    maximumAttempts: 10,
  },
});

/** Workflow that publishes and tracks a tour of events */
export async function publishTourWorkflow(event: Event): Promise<void> {
  wf.setHandler(publishEventSignal, publishEvent);

  const events: TelegramEvent[] = [event];
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
    sleep(30);
  }

  function publishEvent(event: Event) {
    try {
      validateEvent(event);
      const e = findEvent(event, events);
      if (!e) {
        events.push(event);
      }
    } catch (err) {
      console.warn(err);
    }
  }
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
