import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function createRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

/** 3 contact form submissions per hour per IP. */
export const contactLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:contact",
});

/** 5 login attempts per 15 minutes per IP. */
export const loginLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "rl:login",
});

/** 10 beacon calls per minute per IP. */
export const beaconLimiter = new Ratelimit({
  redis: createRedis(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "rl:beacon",
});
