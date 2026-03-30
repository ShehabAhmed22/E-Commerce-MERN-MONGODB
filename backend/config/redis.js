import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const client = new Redis(process.env.UPSTASH_REDIS_URL);

client.on("connect", () => console.log("✅ Redis connected"));
client.on("error", (err) => console.log("❌ Redis error:", err));
