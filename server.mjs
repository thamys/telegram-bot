// server.mjs
import { createServer } from "node:http";
import TelegramBot from "node-telegram-bot-api";
import { processMessage } from "./index.mjs";

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  processMessage(msg, chatId).then((response) => {
    bot.sendMessage(chatId, response, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });
  }).catch((error) => {
    console.log(error);
    bot.sendMessage(chatId, "An error occurred. Please try again later.");
  });
});

const server = createServer();

server.listen(3001, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
