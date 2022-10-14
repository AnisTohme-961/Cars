import express from "express"
import dotenv from "dotenv"
import dbConnection from "./config/mongoconnect.js"
import ErrorHandler from "./Middleware/ErrorHandler.js"
import authRoutes from "./routes/auth.routes.js"

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())


app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "This is the Car Management System API",
    author: "Anis Tohme",
    repository: "https://github.com/AnisTohme-961/Cars.git",
  })
})

app.use("/auth", authRoutes)
app.use(ErrorHandler)

app.listen(PORT, async () => {
  await dbConnection()
  console.log(`Server is running on port ${PORT}`)
})
