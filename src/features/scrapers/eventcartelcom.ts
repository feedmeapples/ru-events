import * as scrapeIt from "scrape-it";
import { Event } from "../../models";
import { extractCity, extractDate } from "./utils";

const _url = "https://eventcartel.com";

export async function fetchEvents(): Promise<Event[]> {
  const urls = await fetchEventUrls();

  const events: Event[] = [];
  for (const url of urls) {
    const event = await fetchEvent(url);
    try {
      validateEvent(event);
      events.push(event);
    } catch (err) {
      const tourEvents = await fetchEventsFromTourPage(url);
      try {
        tourEvents.forEach(validateEvent);
        events.push(...tourEvents);
      } catch {
        console.warn(err);
      }
    }
  }

  return events;
}

async function fetchEventUrls(): Promise<string[]> {
  const { data } = await scrapeIt.default(`${_url}/events/`, {
    events: {
      listItem: ".all-events-item",
      data: {
        url: {
          selector: "a.all-events-item__link",
          attr: "href",
        },
      },
    },
  });

  const urls = (data as any).events.map((e: Event) => `${_url}${e.url}`);
  return urls;
}

async function fetchEvent(url: string): Promise<Event> {
  const { data } = await scrapeIt.default(url, {
    title: ".event-title",
    date: { selector: ".event_calendar_dark", convert: extractDate },
    city: {
      selector: ".place_address_dark",
      convert: extractCity,
    },
  });

  const { title, date, city } = data as any;

  const event: Event = { title, date, city, url, publisher: _url };

  return event;
}

export async function fetchEventsFromTourPage(url: string): Promise<Event[]> {
  const { data } = await scrapeIt.default(url, {
    title: ".tour-page-head h3",
    events: {
      listItem: ".tour-event-list .tr",
      data: {
        date: { selector: ".date", convert: extractDate },
        city: { selector: ".address", convert: extractCity },
      },
    },
  });

  const { title, events: eventsRaw } = data as any;

  const events: Event[] = eventsRaw.map((e: any) => ({
    title,
    city: e.city,
    date: e.date,
    url,
    publisher: _url,
  }));

  return events;
}

function validateEvent(event: Event) {
  if (!event.title) {
    throw new Error(`event title is not set, URL: ${event.url}`);
  }
  if (!event.city) {
    throw new Error(`event city is not set, URL: ${event.url}`);
  }
  if (!event.url) {
    throw new Error(`event url is not set, URL: ${event.url}`);
  }
  if (!event.date) {
    throw new Error(`event date is not set, URL: ${event.url}`);
  } else if (event.date < new Date()) {
    throw new Error(
      `event date is in the past, date: ${event.date}, URL: ${event.url}`
    );
  }
  if (!event.publisher) {
    throw new Error(`event publisher is not set, URL: ${event.url}`);
  }
}