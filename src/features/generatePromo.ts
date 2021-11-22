import { Event, months } from "../models";

export function generatePromoText(events: Event[]) {
  if (events.length === 0) {
    return ""
  }
  
  const messages: string[] = [];
  for (let event of events) {
    const date = new Date(event.date);
    const day = date.getDate();
    const monthIdx = date.getMonth();
    const month = months[monthIdx].abbr;
    messages.push(`${event.title} - ${event.city} - ${month} ${day}`);
  }
  return messages.join("\n\n");
}
