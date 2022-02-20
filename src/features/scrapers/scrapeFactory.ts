import { getEvents as getEventCartelEvents } from "./eventcartelcom";

export type SourceType = "EventCartel";

export function getScraperStrategy(source: SourceType) {
  switch (source) {
    case "EventCartel":
      return getEventCartelEvents;
    default:
      throw new Error(`unknown scraper strategy: ${source}`);
  }
}
