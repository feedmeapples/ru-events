import {
  proxyActivities,
  defineQuery,
  defineSignal,
  setHandler,
  sleep,
} from "@temporalio/workflow";

import * as activities from "../activities";
import { Event } from "../models";
import { validateEvent } from "../features/scrapers/utils";

interface TelegramEvent extends Event {
  isPublished?: boolean;
}

const { sendTelegramMessage, updateTelegramMessage } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "10 seconds",
  retry: {
    initialInterval: "1 minute",
    maximumAttempts: 10,
  },
});

export const publishEventSignal = defineSignal<[Event]>("publishEvent");
export const eventsQuery = defineQuery<TelegramEvent[]>("events");

/** Workflow that publishes and tracks a tour of events */
export async function publishTourWorkflow(event: Event): Promise<void> {
  let events: TelegramEvent[] = [event];
  let messageId: number | undefined;
  let expired = false;

  setHandler(publishEventSignal, publishEvent);
  setHandler(eventsQuery, () => events);

  while (!expired) {
    const untilNextPublish = msUntilNextPublish(); 
    await sleep(untilNextPublish);

    const anyNewEvent = events.some((e) => !e.isPublished);
    if (anyNewEvent) {
      if (messageId) {
        await updateTelegramMessage(messageId, events);
      } else {
        messageId = await sendTelegramMessage(events);
      }

      events = events.map((e) => ({ ...e, isPublished: true }));
    }

    expired = events.every((e) => new Date(e.date) < new Date());
  }

  function publishEvent(event: Event) {
    try {
      validateEvent(event);
      const e = findEvent(event, events);
      if (!e) {
        events.push(event);
      }
    } catch (err) {
      console.warn((err as Error).message);
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

function msUntilNextPublish() {
  return 1 * 60 * 1000 

  const publishTime = 23 * 60 * 60 * 1000 // 23:00 GMT - 6pm EST
  const msInDay = 24 * 60 * 60 * 1000
  return publishTime - new Date().getTime() % msInDay;
}