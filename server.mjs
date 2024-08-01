// server.mjs
import { createServer } from "node:http";
import TelegramBot from "node-telegram-bot-api";

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(msg);
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, "Received your message");
});

const server = createServer();

server.listen(3001, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});

