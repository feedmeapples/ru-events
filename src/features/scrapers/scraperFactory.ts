import { getEvents as getEventCartelEvents } from "./eventcartelcom";
import { getEvents as getBomondEvents } from "./bomondcom";

export type SourceType = "EventCartel" | "Bomond";

export function getScraperStrategy(source: SourceType) {
  switch (source) {
    case "EventCartel":
      return getEventCartelEvents;
    case "Bomond":
      return getBomondEvents;
    default:
      throw new Error(`unknown scraper strategy: ${source}`);
  }
}
