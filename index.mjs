import { getHelp } from "./commands/index.mjs";

export function processMessage(message, chatId) {
  let response = "Welcome to D&D Bot!";
  response += getHelp();
  return response;
}
