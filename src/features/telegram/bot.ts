import { Bot } from "grammy";
import { InlineKeyboardButton } from "grammy/out/platform.node";
import { getConfig } from "../config";

const cfg = getConfig();

if (!cfg.tgChatId) {
  throw new Error("CHAT_ID is not defined");
}

if (!cfg.tgToken) {
  throw new Error("TELEGRAM_TOKEN is not defined");
}

export async function sendMessage(
  message: string,
  pictureUrl: string,
  buttons: InlineKeyboardButton[]
): Promise<number> {
  const bot = new Bot(cfg.tgToken);
  const msg = await bot.api.sendPhoto(cfg.tgChatId, pictureUrl, {
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
  const bot = new Bot(cfg.tgToken);
  await bot.api.editMessageCaption(cfg.tgChatId, messageId, {
    caption: message,
    reply_markup: {
      inline_keyboard: [buttons],
    },
  });
}
