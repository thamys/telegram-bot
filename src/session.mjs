import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

client.on("error", (err) => console.log("Redis Client Error", err));
await client.connect();

export default client;
