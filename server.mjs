// server.mjs
import { createServer } from "node:http";
import TelegramBot from "node-telegram-bot-api";
import startTelegramListener from "./src/telegram.mjs";

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

startTelegramListener(bot);

const server = createServer();

server.listen(3333, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3333");
});
