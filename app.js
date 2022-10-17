import express from "express"
import dotenv from "dotenv"
import dbConnection from "./config/mongoconnect.js"
import ErrorHandler from "./Middleware/ErrorHandler.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import carRoutes from "./routes/car.routes.js"
import categoryRoutes from "./routes/category.routes.js"

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Welcome! This is the Car Management System API",
    author: "Anis Tohme",
    repository: "https://github.com/AnisTohme-961/Cars.git",
  })
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/cars", carRoutes)
app.use("/categories", categoryRoutes)

//app.use('/uploads', express.static('uploads'))

app.use(ErrorHandler)

app.listen(PORT, async () => {
  await dbConnection()
  console.log(`Server is running on port ${PORT}`)
})
