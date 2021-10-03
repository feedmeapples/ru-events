import { compareTwoStrings } from "string-similarity";
import CyrillicToTranslit from "cyrillic-to-translit-js";

export function isSameTour(event1: string, event2: string): boolean {
  event1 = cleanText(event1);
  event2 = cleanText(event2);

  const similarity = compareTwoStrings(event1, event2);
  return similarity > 0.6;
}

const exclude = [/tour/, /usa/, /\d{4}/];

export function cleanText(text: string): string {
  const translit = new CyrillicToTranslit();
  text = translit.transform(text);

  exclude.forEach((ex) => {
    text = text.replace(ex, "");
  });

  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}
