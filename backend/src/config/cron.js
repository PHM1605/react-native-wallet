// to keep service active (as it will deactivate after 15 minutes no request)
// we want to send 1 GET request for every 14 minutes
// MINUTE, HOUR, DAY OF THE MONTH, MONTH, DAY OF THE WEEK
// 14 * * * * - every 14 minutes
// 0 0 * * 0 - at midnight every Sunday (0th day)
import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
    https.get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) console.log("GET request sent successfully");
        else console.log("GET request failed", res.statusCode);
    })
    .on("error", (e) => console.error("Error while sending request", e));
})

export default job;