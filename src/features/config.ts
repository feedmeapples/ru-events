import { readFileSync } from "fs";
import { config as configEnv } from "dotenv";
configEnv();

const temporalAddress = process.env.TEMPORAL_ADDRESS;
const namespace = process.env.TEMPORAL_NAMESPACE;
const certPath = process.env.TEMPORAL_CERT;
const keyPath = process.env.TEMPORAL_KEY;
const tgChatId = process.env.TELEGRAM_CHAT_ID || "";
const tgToken = process.env.TELEGRAM_TOKEN || "";

export function getConfig() {
  const cert = certPath ? readFileSync(certPath) : undefined;
  const key = keyPath ? readFileSync(keyPath) : undefined;

  return {
    temporalAddress,
    namespace,
    cert,
    key,
    tgChatId,
    tgToken,
  };
}
