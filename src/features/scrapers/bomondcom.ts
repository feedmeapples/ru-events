import * as scrapeIt from "scrape-it";
import { Event } from "../../models";
import {
  extractCity,
  extractDate,
  extractDateValues,
  validateEvent,
} from "./utils";

const _name = "Bomond";
const _url = "https://bomond.com";

export async function getEvents(): Promise<Event[]> {
  const urls = await scrapeEventUrls();

  let events: Event[] = [];
  for (const url of urls) {
    if (isEvent(url)) {
      events.push(await scrapeEventPage(url));
    } else if (isTour(url)) {
      events.push(...(await scrapeTourPage(url)));
    }
  }

  return events.filter(validateEventAndLogError);
}

export async function scrapeEventUrls(): Promise<string[]> {
  const { data } = await scrapeIt.default(`${_url}/events/`, {
    links: {
      listItem: ".app__content section.content-wrapper a",
      data: {
        url: { attr: "href" },
      },
    },
  });

  let events = (data as any).links as { url: string }[];
  events = events.filter((e) => isEvent(e.url) || isTour(e.url));

  return events.map((e) => `${_url}${e.url}`);
}

export async function scrapeEventPage(url: string): Promise<Event> {
  const { data } = await scrapeIt.default(url, {
    title: ".event-title",
    image: {
      selector: ".tour-page-image img",
      attr: "src",
    },
    day: ".event_calend_dark .date",
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
    image: {
      selector: ".app__content div div a",
      attr: "srcmobile",
    },
    content: {
      selector: ".app__content > div > section.content-wrapper",
      data: {
        contentSections: {
          selector: "div",
          data: {
            title: {
              eq: 0,
            },
            eventsContainer: {
              eq: 1,
              data: {
                eventsList: {
                  listItem: "div a",
                  data: {
                    event: {
                      listItem: "div div",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  let image = (data as any).image;
  const title = (data as any).content.contentSections.title;
  const eventsRaw = (data as any).content.contentSections.eventsContainer
    .eventsList;

  if (image.startsWith("/")) {
    image = _url + image;
  }

  const events: Event[] = eventsRaw.map((e: any) => {
    const date = extractDate(e.event[1]);
    const city = extractCity(e.event[3]);

    return {
      title: title,
      city: city,
      date: date,
      url,
      image,
      publisher: _name,
    };
  });

  return events;
}

function isEvent(url: string): boolean {
  return url.includes("/events/");
}

function isTour(url: string): boolean {
  return url.includes("/tours/");
}

function validateEventAndLogError(event: Event): boolean {
  try {
    validateEvent(event);
    return true;
  } catch (err) {
    // console.warn(`${_name}: ${(err as Error).message}`);
  }

  return false;
}
