// server.mjs
import { createServer } from "node:http";
import TelegramBot from "node-telegram-bot-api";
import { processMessage } from "./index.mjs";

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  console.log(msg);
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, processMessage(msg, chatId));
});

const server = createServer();

server.listen(3001, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
