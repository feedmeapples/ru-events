import {
  generatePromoButtons,
  generatePromoText,
} from "./features/generatePromo";
import {
  getScraperStrategy,
  SourceType,
} from "./features/scrapers";
import { sendMessage, updateMessage } from "./features/telegram/bot";
import { Event } from "./models";

export async function fetchEvents(source: SourceType): Promise<Event[]> {
  const fetchEventsFromSource = getScraperStrategy(source);
  return await fetchEventsFromSource();
}

export async function sendTelegramMessage(events: Event[]): Promise<number> {
  const pictureUrl = events?.[0].image;
  const message = generatePromoText(events);
  const buttons = generatePromoButtons(events);

  return await sendMessage(message, pictureUrl, buttons);
}

export async function updateTelegramMessage(
  messageId: number,
  events: Event[]
) {
  const message = generatePromoText(events);
  const buttons = generatePromoButtons(events);

  return await updateMessage(messageId, message, buttons);
}
