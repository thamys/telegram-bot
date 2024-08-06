export async function fetchAllCommands() {
  const response = await fetch(process.env.API_URL + "/api");
  return response.json();
}

export async function fetchCommandData(command) {
  const response = await fetch(process.env.API_URL + command);
  return response.json();
}

export default {
  fetchAllCommands,
  fetchCommandData,
};
