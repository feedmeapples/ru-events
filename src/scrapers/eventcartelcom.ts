import * as scrapeIt from "scrape-it";
import { Event } from "../models";

const _url = "https://eventcartel.com"

export async function fetchEvents(): Promise<Event[]> {
  const urls = await fetchEventUrls();

  const events: Event[] = [];
  for (const url of urls) {
    const event = await fetchEventDetails(url);
    events.push(event);
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

async function fetchEventDetails(url: string): Promise<Event> {
  const { data } = await scrapeIt.default(url, {
    title: ".event-title",
    date: ".event_calendar_dark",
    city: ".place_address_dark",
  });

  const { title, date, city } = data as any;

  return {
    title,
    date,
    city,
    url,
  };
}
