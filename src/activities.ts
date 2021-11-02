import { fetchEventsEventCartel } from "./features/scrapers";
import { sendMessage } from "./features/telegram/bot";
import { Event, months } from "./models";

export async function fetchEvents(): Promise<Event[]> {
  return await fetchEventsEventCartel();
}
export async function sendTelegramMessage(event: Event) {
  const date =  new Date(event!.date)
  const day = date.getDate()
  const monthIdx = date.getMonth();
  console.log(
    `Sending message for ${event!.title}. m index ${monthIdx}, ${JSON.stringify(months[monthIdx])}`
  );
  const month = months[monthIdx].abbr;
  
  const message = `${event.title} - ${event.city} - ${month} ${day}`;
  await sendMessage(message);
}

