import { fetchEventsEventCartel } from "./scrapers";
import { Event } from "./models/event";

export async function fetchEvents(): Promise<Event[]> {
  return await fetchEventsEventCartel();
}
