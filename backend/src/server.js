import express from "express"
import dotenv from "dotenv"
import { initDB } from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import transactionsRoute from "./routes/transactionsRoute.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// middleware
app.use(rateLimiter) // limit for a user to send e.g. 4 requests per minute only
app.use(express.json())
// app.use((req, res, next) => {
//     console.log("Hey we hit a req, the method is ", req.method)
//     next()
// })

app.use("/api/transactions", transactionsRoute)

// init DB first, before creating app
initDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is up and running on PORT: ", PORT)
    })
})
