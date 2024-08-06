import { commands } from "./constants.mjs";
import { fetchCommandData } from "./d-and-d-api.mjs";
import { getCommandObject } from "./helpers.mjs";

export default function startTelegramListener(bot) {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    const response = await processMessage(msg, chatId);

    if (!response) return;

    const escapedString = response.replace(/_/g, "\\_");
    
    bot.sendMessage(chatId, escapedString, { parse_mode: "Markdown" });
  });
}

async function processMessage(message, chatId) {
  const type = message?.entities?.[0]?.type || "";

  if (type != "bot_command") return;
  const text = message?.text || "";

  let response = "";

  if (text == "/start") {
    response += "Welcome to D&D Bot!\n";
    response +=
      "Type /help to see the available commands or type / followed by the command you want to use.";
    return response;
  }

  if (text == "/help") {
    return showHelper();
  }

  response = await processCommand(text, chatId);
  response += "\n\n Type /help to see the available commands.";

  return response;
}

async function processCommand(command, chatId) {

  const commandObject = getCommandObject(command, chatId);

  if (!commandObject) {
    return "Invalid command. Type /help to see the available commands.";
  }

  if (commandObject.children)
    return showList(commandObject.children, commandObject.name);

  const result = await fetchCommandData(commandObject.url);
  return showDetails(result, commandObject.name);
}

function showHelper() {
  let response = "Available commands:\n";

  response += showList(commands, "Available commands");
  response += "\n\nType / followed by the command you want to use.";

  return response;
}

function showList(results, name) {
  let responseTxt = `List of ${name}:\n`;

  results.forEach((result) => {
    responseTxt += `\n[/${result.index.replaceAll("-", "_")}](${
      result.url
    }) - ${result.name}`;
  });

  return responseTxt;
}

function showDetails(result) {
  let responseTxt = `Details for ${result.name}:\n`;

  Object.entries(result).forEach(([key, value]) => {
    if (key === "name" || key === "url" || key === "index") return;
    responseTxt += `\n**${key}**: ${value || value.join(", ")}`;
  });

  return responseTxt;
}
