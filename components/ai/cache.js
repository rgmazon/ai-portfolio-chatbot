import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

export async function getCachedResponse(key) {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Cache error:", error);
    return null;
  }
}

export async function setCachedResponse(key, data, ttlSeconds = 3600) {
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch (error) {
    console.error("Cache error:", error);
  }
}