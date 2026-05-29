import ratelimit from "../config/upstash.js"

// middleware to limit rate
const rateLimiter = async (req, res, next) => {
    try {
        const {success} = await ratelimit.limit("my-rate-limit") // will be "userId" or "IPAddress" later when we have authentication
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." })
        }
        next()
    } catch(error) {
        console.log("Rate limit error", error)
        next(error)
    }
}
export default rateLimiter;