import { InlineKeyboardButton } from "grammy/out/platform.node";
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

    const eventTxt = `${event.city?.icon} ${month}. ${day} ${event.city?.name}`;
    if (eventsTxt.includes(eventTxt)) {
      continue;
    }

    eventsTxt.push(eventTxt);
  }

  return `✨${title}\n\n${eventsTxt.join("\n")}\n\n🎫 Билеты:`;
}

export function generatePromoButtons(events: Event[]): InlineKeyboardButton[] {
  if (events.length === 0) {
    return [];
  }

  let buttons = events.map((event) => ({
    text: event.publisher,
    url: event.url,
  }));

  buttons = buttons.filter(
    (x, i, a) => a.map((e) => e.text).indexOf(x.text) == i
  );

  return buttons;
}
