import {
  generatePromoButtons,
  generatePromoText,
} from "./features/generatePromo";
import { fetchEventsEventCartel } from "./features/scrapers";
import { sendMessage, updateMessage } from "./features/telegram/bot";
import { Event } from "./models";

export async function fetchEvents(): Promise<Event[]> {
  return await fetchEventsEventCartel();
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
