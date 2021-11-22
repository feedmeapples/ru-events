import { generatePromoText } from "./features/generatePromo";
import { fetchEventsEventCartel } from "./features/scrapers";
import { sendMessage, updateMessage } from "./features/telegram/bot";
import { Event } from "./models";

export async function fetchEvents(): Promise<Event[]> {
  return await fetchEventsEventCartel();
}
export async function sendTelegramMessage(events: Event[]): Promise<number> {
  const message = generatePromoText(events);
  return await sendMessage(message);
}

export async function updateTelegramMessage(messageId: number, events: Event[]) {
  const message = generatePromoText(events);
  return await updateMessage(messageId, message);
}
