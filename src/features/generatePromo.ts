import { Event, months } from "../models";

export function generatePromoText(events: Event[]) {
  if (events.length === 0) {
    return "";
  }

  const title = events[0].title;

  const eventsTxt: string[] = [];
  for (let event of events) {
    const date = new Date(event.date);
    const day = date.getDate();
    const monthIdx = date.getMonth();
    const month = months[monthIdx].abbr;
    eventsTxt.push(`${event.city?.icon} ${month}. ${day} ${event.city?.name}`);
  }

  return `✨${title}\n\n${eventsTxt.join("\n")}`;
}
