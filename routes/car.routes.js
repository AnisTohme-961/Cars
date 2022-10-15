import express from "express"
import multer from "multer"
import Car from "../models/car.js"
import {
  createCar,
  getCarById,
  getCars,
} from "../controllers/car.controllers.js"
import { verifyLogin } from "../Middleware/Verification.js"
import Validator from "../Middleware/Validator.js"

const router = express.Router()

const upload = multer({ dest: "uploads/" })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

/*const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
})*/

// @route   GET /cars
// @desc    Get all cars
// @access  Private
router.get("/", verifyLogin, getCars)

// @route   GET /car/id
// @desc    Get car by id
// @access  Private

router.get("/:carId", verifyLogin, getCarById)

// @route   POST /car
// @desc    Add car
// @access  Private

router.post("/", upload.single("carImage"), createCar)

export default router
