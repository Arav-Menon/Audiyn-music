import { createClient } from "redis";

export const redisClient = await createClient()
  .on("error", (err) => console.log("Redis client error", err))
  .connect();
