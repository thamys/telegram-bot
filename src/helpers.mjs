import { commands } from "./constants.mjs";

export function getCommandObject(command, chatId) {
  const commandKey = command.substring(1);
  const commandObject = findCommandObject(commandKey);
  return commandObject;
}

function findCommandObject(commandKey) {
  const index = commandKey.replaceAll("_", "-");

  let commandObject = commands.find((c) => c.index === commandKey);

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
