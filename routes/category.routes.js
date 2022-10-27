import express from "express"
import { verifyLogin } from "../Middleware/Verification.js"
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  groupCarByCategory,
  updateCategory,
} from "../controllers/category.controllers.js"
import Validator from "../Middleware/Validator.js"

const router = express.Router()

// @route   GET /categories
// @desc    Get all categories
// @access  Private

router.get("/", verifyLogin, getCategories)

// @route   GET /categories/cars
// @desc    Group Cars By Category
// @access  Private

router.get("/cars", verifyLogin, groupCarByCategory)

// @route   GET /categories/:categoryId
// @desc    Get category
// @access  Private

router.get("/:categoryId", verifyLogin, getCategoryById)

// @route   POST /categories/
// @desc    Create category
// @access  Private

router.post("/", verifyLogin, Validator("category"), createCategory)

// @route   PUT  /categories/:categoryId
// @desc    UPDATE category
// @access  Private

router.put("/:categoryId", verifyLogin, Validator("category"), updateCategory)

// @route   DELETE /categories/:categoryId
// @desc    Delete category
// @access  Private

router.delete("/:categoryId", verifyLogin, deleteCategory)

export default router
