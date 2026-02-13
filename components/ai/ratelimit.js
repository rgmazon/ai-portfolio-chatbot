import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: `${process.env.UPSTASH_REDIS_URL}`,
  token: `${process.env.UPSTASH_REDIS_TOKEN}`,
});

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1m"), // 5 requests per minute per user
});