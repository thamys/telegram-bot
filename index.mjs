import { rootCommands } from "./constants.mjs";
import session from "./session.mjs";
const API_URL = "https://www.dnd5eapi.co";

export default function startTelegramListener(bot) {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    processMessage(msg, chatId)
      .then((response) => {
        console.log(response);
        bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
      })
      .catch((error) => {
        console.log(error);
        bot.sendMessage(chatId, "An error occurred. Please try again later.");
      });
  });
}

async function fetchCommandData(url) {
  try {
    const response = await fetch(`${API_URL}${url}`);
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function showList(results, name) {
  let responseTxt = `List of ${name}:`;
  results.forEach((result) => {
    responseTxt += `\n[/${result.index.replaceAll("-", "_")}](${
      result.url
    }) - ${result.name}`;
  });
  return responseTxt;
}

function showDetails(result) {
  // @TODO: Implement the showDetails generic function
  let responseTxt = `Details for ${result.name}:`;
  responseTxt += `\nPrerequisites:`;
  result.prerequisites.forEach((prerequisite) => {
    responseTxt += `\n- ${prerequisite.ability_score.name} ${prerequisite.minimum_score}`;
  });
  responseTxt += `\nDescription:`;
  result.desc.forEach((desc) => {
    responseTxt += `\n- ${desc}`;
  });
  return responseTxt;
}

async function getHelp() {
  let response = "Available commands:";
  response += "\n/help - List available commands";
  const options = await fetchCommandData("/api");
  Object.entries(options).forEach(([key, value]) => {
    const command = key.replaceAll("-", "_");
    response += `\n[/${command}](/${value}) - List of ${key}`;
  });
  return response;
}

async function getCommandUrl(command, chatId) {
  const key = command.replaceAll("_", "-").replace("/", "");
  if (rootCommands[key]) {
    return rootCommands[key];
  }
  const userSession = await session.hGetAll(`user-session:${chatId}`);
  if (userSession && userSession.lastCommand) {
    const lastCommand = userSession.lastCommand
      .replaceAll("_", "-")
      .substring(1);
    const lastCommandURI = rootCommands[lastCommand];
    return `${lastCommandURI}/${key}`;
  }
}

async function processCommand(command, chatId) {
  const option = command.substring(1);
  const commandURI = await getCommandUrl(command, chatId);
  await session.hSet(`user-session:${chatId}`, {
    lastCommand: command,
  });
  const result = await fetchCommandData(commandURI);
  if (Array.isArray(result)) {
    return showList(result, option);
  }
  return showDetails(result);
}

export async function processMessage(message, chatId) {
  const type = message?.entities[0]?.type || "";
  let response = "";

  if (type == "bot_command" && message.text == "/start") {
    response += "Welcome to D&D Bot!\n";
    response +=
      "Type /help to see the available commands or type / followed by the command you want to use.";
    return response;
  }

  if (type == "bot_command" && message.text == "/help") {
    return await getHelp();
  }

  if (type == "bot_command") {
    return await processCommand(message.text, chatId);
  }

  return "Invalid command. Type /help to see the available commands.";
}
