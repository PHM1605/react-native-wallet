import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/rateLimit"
import "dotenv/config";

// console.log(process.env)

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60s") // maximum 100 requests per 60s
});

export default ratelimit