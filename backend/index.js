import cron from "node-cron";
import { fetchAndSaveRSS } from "./utils/rssFetcher.js";
import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"

dotenv.config()

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.log(err)
  })

const app = express()

// for allowing json object in req body
app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`)
})
// Sunucu her açıldığında bir kere RSS verisi çeksin
fetchAndSaveRSS();

// Her saat başı RSS güncellemesi yap
cron.schedule("0 * * * *", async () => {
  console.log("⏰ Her saat başı RSS çekiliyor...");
  await fetchAndSaveRSS();
});


app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
