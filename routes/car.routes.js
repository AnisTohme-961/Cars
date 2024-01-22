import express from "express"
//import multer from "multer"
import Car from "../models/car.js"
import {
  addCar,
  deleteCar,
  groupCarsByCategories,
  getCarById,
  getCars,
  getCarsByCoordinates,
  getCarWithTags,
  searchCars,
  searchCarsByTags,
  updateCar,
} from "../controllers/car.controllers.js"
import { verifyLogin } from "../Middleware/Verification.js"
import Validator from "../Middleware/Validator.js"

const router = express.Router()

/*const upload = multer({ dest: "images/" })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/")
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

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
})*/

// @route   GET /cars
// @desc    Get all cars
// @access  Private

router.get("/", verifyLogin, getCars)

// @route   Get /cars/?key:value  
// @desc    Search Cars By Key and Value
// @access  Private

router.get("/search", verifyLogin, searchCars)

// @route   Get /cars/?tags
// @desc    Search Cars By Tags
// @access  Private

router.get("/tags", verifyLogin, searchCarsByTags)

// @route   GET /cars/?lng=value&lat=value
// @desc    GET Cars By Coordinates
// @access  Private

router.get("/coordinates", verifyLogin, getCarsByCoordinates)

// @route   GET /cars/categories
// @desc    GET Cars and Group Them By Categories
// @access  Private

router.get("/categories", verifyLogin, groupCarsByCategories)

// @route   GET /cars/:carId
// @desc    Get car by id
// @access  Private


router.get("/:carId", verifyLogin, getCarById)

// @route   GET/cars/:carId/tags
// @desc    GET Car with or without tag
// @access  Private

router.get("/:carId/tags", verifyLogin, getCarWithTags)

// @route   POST /car
// @desc    Add car
// @access  Private

router.post("/", verifyLogin, Validator("car"), addCar)

// @route   PUT /car
// @desc    Update car
// @access  Private

router.put("/:carId", verifyLogin, Validator("car"), updateCar)

// @route   DELETE /car
// @desc  - Delete car
// @access  Private

router.delete("/:carId", verifyLogin, deleteCar)

export default router
