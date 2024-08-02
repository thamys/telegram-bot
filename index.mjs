const API_URL = "https://www.dnd5eapi.co";

// interface ApiResponse {
//   count: number;
//   results: [
//     { index: string, name: string, url: string }
//   ];
// }

async function fetchCommandData(url) {
  try {
    const response = await fetch(`${API_URL}/api${url}`);
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.log(`${API_URL}${url}`);
    return error;
  }
}

async function getDetails(url, name) {
  try {
    const results = await fetchCommandData(url);
    let responseTxt = `List of ${name}:`;
    results.forEach((result) => {
      responseTxt += `\n\n[/${result.index.replace("-", "_")}](${
        result.url
      }) - ${result.name}`;
    });
    return responseTxt;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

async function getHelp() {
  let response = "\n\nAvailable commands:";
  response += "\n\n/help - List available commands";
  const options = await fetchCommandData("");
  for (const [option, url] of Object.entries(options)) {
    const command = url.split("/").pop();
    response += `\n\n/${command.replace("-", "_")} - Get ${option}`;
  }
  return response;
}

async function processComand(command) {
  if (!command.startsWith("/") || command === "/help") {
    return await getHelp();
  }
  const option = command.substring(1);
  return await getDetails(command, option);
}

export async function processMessage(message, chatId) {
  let response = "Welcome to D&D Bot!\n\n";
  response += await processComand(message.text);
  return response;
}
