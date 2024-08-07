import { getCommandObject } from "./helpers.mjs";
import { fetchCommandData } from "./d-and-d-api.mjs";


export async function processMessage(message, chatId) {
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

  response = await processCommand(text, chatId);
  return response;
}

async function processCommand(command, chatId) {
  const commandObject = getCommandObject(command, chatId);

  if (!commandObject) {
    return "Invalid command. Type /help to see the available commands.";
  }

  if (commandObject.children)
    return {
      name: commandObject.name,
      result: commandObject.children,
    };

  const result = await fetchCommandData(commandObject.url);
  return {
    name: commandObject.name,
    result,
  };
}