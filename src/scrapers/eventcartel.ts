import * as scrapeIt from "scrape-it";
import { Event } from "../models/event";

export async function fetchEvents(): Promise<Event[]> {
  const events = await fetchEventUrls();
  return events;
}

async function fetchEventUrls(): Promise<Event[]> {
  const { data } = await scrapeIt.default("https://eventcartel.com/events/", {
    events: {
      listItem: ".all-events-item",
      data: {
        title: ".all-events-item__title",
        url: {
          selector: "a.all-events-item__link",
          attr: "href",
        },
      },
    },
  });

  return (data as any).events;
}
