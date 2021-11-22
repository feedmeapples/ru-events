import { cities, City, months, Event } from "../../models";

export function extractCity(address: string): City | null {
  for (const cityName in cities) {
    const city = cities[cityName];

    for (const alias of city.aliases) {
      const regex = new RegExp(`\\b${alias}\\b`, "i");

      if (regex.test(address)) {
        return city;
      }
    }
  }

  return null;
}

export function extractDate(dateRaw: string) {
  const { year, month, day } = extractDateValues(dateRaw);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month, day).toISOString();
}

export function extractDateValues(dateRaw: string): {
  year: number | null;
  month: number | null;
  day: number | null;
} {
  // try format 05/30/2022
  let regex = /\b(\d{1,2})\/(\d{1,2})\/(20\d{2})\b/;
  let match = regex.exec(dateRaw);
  if (match?.length == 4) {
    const month = parseInt(match[1]) - 1;
    const day = parseInt(match[2]);
    const year = parseInt(match[3]);

    return { year, month, day };
  }

  // extract month
  let month: number | null = null;
  for (const m of months) {
    regex = new RegExp(`\\b(${m.name}|${m.abbr})\\b`, "i");
    match = regex.exec(dateRaw);
    if (match?.length == 2) {
      month = months.indexOf(m);
      break;
    }
  }
  // extract day from formats Nov, Nov 12, November 12 2024, Nov 2024
  let day: number | null = null;
  if (month != null) {
    const m = months[month];
    regex = new RegExp(`\\b(${m.name}|${m.abbr})\\s(\\d{1,2})\\b`, "i");
    match = regex.exec(dateRaw);
    day = parseInt(match?.[2] || "");
  }

  // extract year
  regex = /\b(20\d{2})\b/;
  match = regex.exec(dateRaw);
  let year = parseInt(match?.[1] || "");
  if (!year && month != null && day != null) {
    // year is not provided. Assume the year is current or next
    const now = new Date();
    const thisYear = now.getFullYear();
    const isCurrentYear =
      new Date(thisYear, month, day).getTime() -
        new Date(thisYear, now.getMonth(), now.getDate()).getTime() >=
      0;
    year = isCurrentYear ? thisYear : thisYear + 1;
  }

  return { year, month, day };
}

export function validateEvent(event: Event) {
  if (!event.title) {
    throw new Error(`event title is not set. URL: ${event.url}`);
  }
  if (!event.city) {
    throw new Error(`event city is not set. URL: ${event.url}`);
  }
  if (!event.url) {
    throw new Error(`event url is not set. URL: ${event.url}`);
  }
  if (!event.date) {
    throw new Error(`event date is not set. URL: ${event.url}`);
  } else if (new Date(event.date) < new Date()) {
    throw new Error(
      `event date is in the past, Date: ${event.date}. URL: ${event.url}`
    );
  }
  if (!event.publisher) {
    throw new Error(`event publisher is not set. URL: ${event.url}`);
  }
}
