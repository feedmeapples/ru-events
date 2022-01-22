import * as scrapeIt from "scrape-it";
import { Event } from "../../models";
import {
  extractCity,
  extractDate,
  extractDateValues,
  validateEvent,
} from "./utils";

const _name = "EventCartel";
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
    image: {
      selector: ".tour-page-image img",
      attr: "src",
    },
    day: ".event_calendar_dark .date",
    monthRaw: ".event_calendar_dark .month",
    cityRaw: ".place_address_dark",
  });

  const { title, image, day, monthRaw, cityRaw } = data as any;
  let { year, month } = extractDateValues(monthRaw);
  const city = extractCity(cityRaw);

  let date = new Date(0).toISOString();
  if (year && month && day) {
    date = new Date(year, month, day).toISOString();
  }

  const event: Event = { title, image, date, city, url, publisher: _name };

  return event;
}

export async function scrapeTourPage(url: string): Promise<Event[]> {
  const { data } = await scrapeIt.default(url, {
    title: ".tour-page-head .h3",
    image: {
      selector: ".tour-page-image img",
      attr: "src",
    },
    events: {
      listItem: ".tour-event-list .tr",
      data: {
        date: { selector: ".date", convert: extractDate },
        city: { selector: ".address", convert: extractCity },
      },
    },
  });

  let { title, image, events: eventsRaw } = data as any;

  if (image.startsWith("/")) {
    image = _url + image;
  }

  const events: Event[] = eventsRaw.map((e: any) => ({
    title,
    image,
    city: e.city,
    date: e.date,
    url,
    publisher: _name,
  }));

  return events;
}
