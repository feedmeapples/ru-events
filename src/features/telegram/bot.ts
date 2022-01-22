import { Bot } from "grammy";
import { config as configEnv } from "dotenv";
import { InlineKeyboardButton } from "grammy/out/platform.node";
configEnv();

const chatId = process.env.CHAT_ID || "";
const token = process.env.TELEGRAM_TOKEN || "";

if (!chatId) {
  throw new Error("CHAT_ID is not defined");
}

if (!token) {
  throw new Error("TELEGRAM_TOKEN is not defined");
}

export async function sendMessage(
  message: string,
  pictureUrl: string,
  buttons: InlineKeyboardButton[]
): Promise<number> {
  const bot = new Bot(token);
  const msg = await bot.api.sendPhoto(chatId, pictureUrl, {
    caption: message,
    reply_markup: {
      inline_keyboard: [buttons],
    },
  });
  return msg.message_id;
}

export async function updateMessage(
  messageId: number,
  message: string,
  buttons: InlineKeyboardButton[]
) {
  const bot = new Bot(token);
  await bot.api.editMessageCaption(chatId, messageId, {
    caption: message,
    reply_markup: {
      inline_keyboard: [buttons],
    },
  });
}
