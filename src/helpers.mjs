import { commands } from "./constants.mjs";

export function getCommandObject(command, chatId) {
  const commandKey = command.substring(1).replaceAll("_", "-");
  const commandObject = findCommandObject(commandKey);
  return commandObject;
}

function findCommandObject(index) {
  let commandObject = commands.find((c) => c.index === index);

  if (commandObject) return commandObject;

  commands.find((c) => {
    if (c.children) {
      return c.children.find((sc) => {
        if (sc.index === index) {
          commandObject = sc;
          return true;
        }
      });
    }
  });

  return commandObject;
}


function escapeMessageRecursive(message) {
  if (typeof message === "string") {
    return message.replace(/([*_`[\]()/~>#+-=|{}.!])/g, "$1");
  }

  if (Array.isArray(message)) {
    return message.map((m) => escapeMessageRecursive(m));
  }

  if (typeof message === "object") {
    return Object.fromEntries(
      Object.entries(message).map(([key, value]) => [
        key,
        escapeMessageRecursive(value),
      ])
    );
  }

  return message;
}

function transformMessageIntoStringRecursive(message) {
  if (typeof message === "string") {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "object") {
    return JSON.stringify(message, null, 2);
  }

  return message;
}

export function escapeMessageRecursiveAndTransformIntoString(message) {
  return transformMessageIntoStringRecursive(escapeMessageRecursive(message));
}