import * as scrapeIt from "scrape-it";
import { Event } from "../../models";
import { extractCity, extractDate, extractDateValues } from "./utils";

const _url = "https://eventcartel.com";

export async function getEvents(): Promise<Event[]> {
  const urls = await scrapeEventUrls();

  const events: Event[] = [];
  for (const url of urls) {
    const event = await scrapeEventPage(url);
    try {
      validateEvent(event);
      events.push(event);
    } catch (err) {
      const tourEvents = await scrapeTourPage(url);

      for (const tourEvent of tourEvents) {
        try {
          validateEvent(tourEvent);
          events.push(tourEvent);
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }

  return events;
}

async function scrapeEventUrls(): Promise<string[]> {
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

export async function scrapeEventPage(url: string): Promise<Event> {
  const { data } = await scrapeIt.default(url, {
    title: ".event-title",
    day: ".event_calendar_dark .date",
    monthRaw: ".event_calendar_dark .month",
    cityRaw: ".place_address_dark",
  });

  const { title, day, monthRaw, cityRaw } = data as any;
  let { year, month } = extractDateValues(monthRaw);
  const city = extractCity(cityRaw) || "";

  let date = new Date(0).toISOString();
  if (year && month && day) {
    date = new Date(year, month, day).toISOString();
  }

  const event: Event = { title, date, city, url, publisher: _url };

  return event;
}

export async function scrapeTourPage(url: string): Promise<Event[]> {
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

export function validateEvent(event: Event) {
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
  } else if (new Date(event.date) < new Date()) {
    throw new Error(
      `event date is in the past, date: ${event.date}, URL: ${event.url}`
    );
  }
  if (!event.publisher) {
    throw new Error(`event publisher is not set, URL: ${event.url}`);
  }
}
