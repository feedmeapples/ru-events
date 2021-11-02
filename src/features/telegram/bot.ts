import { Bot } from "grammy";
import { config as configEnv } from "dotenv";
configEnv();

const chatId = process.env.CHAT_ID || "";
const token = process.env.TELEGRAM_TOKEN || "";

if (!chatId) {
  throw new Error("CHAT_ID is not defined");
}

if (!token) {
  throw new Error("TELEGRAM_TOKEN is not defined");
}

export async function sendMessage(message: string) {
  const bot = new Bot(token);
  await bot.api.sendMessage(chatId, message);
}
