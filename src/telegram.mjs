import { commands } from "./constants.mjs";
import { escapeMessageRecursiveAndTransformIntoString } from "./helpers.mjs";
import { processMessage } from "./index.mjs";

export default function startTelegramListener(bot) {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text == "/help") {
      return showHelper(chatId, bot);
    }

    const response = await processMessage(msg, chatId);

    if (!response) return;

    if (typeof response === "string") {
      return bot.sendMessage(chatId, response);
    }

    if (Array.isArray(response.result)) {
      showList(response, chatId, bot);
      return;
    }

    showDetails(response, chatId, bot);
  });
}

function showHelper(chatId, bot) {
  showList(
    {
      name: "Available commands",
      result: commands,
    },
    chatId,
    bot
  );
}

function showList(response, chatId, bot) {
  const { name, result: results } = response;
  let responseTxt = `List of ${name}:\n`;

  results.forEach((result) => {
    responseTxt += `\n[/${result.index.replaceAll("-", "_")}](${
      result.url
    }) - ${result.name}`;
  });

  bot.sendMessage(chatId, responseTxt, { parse_mode: "Markdown" });
}

function showDetails(response, chatId, bot) {
  const {
    result: { name, index, url, ...results },
  } = response;

  let message = `# Details for ${name}:\n`;

  Object.entries(results).forEach(([key, value]) => {
    const messageKey = key
      .replaceAll("_", " ").toUpperCase();

    const messageValue = escapeMessageRecursiveAndTransformIntoString(value);

    message += `\n\n**${messageKey}**: ${messageValue}`;
  });

   bot.sendMessage(chatId, message, {
     parse_mode: "Markdown",
   });
}
