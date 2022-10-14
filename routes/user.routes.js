import express from "express"
import { verifyLogin } from "../Middleware/Verification.js"
import Validator from "../Middleware/Validator.js"
import {
  changePassword,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controllers.js"

const router = express.Router()

// @route   GET /users/
// @desc    Get all users
// @access  Private

router.get("/", verifyLogin, getUsers)

// @route   GET /user/id
// @desc    Get user
// @access  Private

router.get("/:id", verifyLogin, getUserById)

// @route   PUT /users/
// @desc    Update user
// @access  Private

router.put("/", verifyLogin, Validator("user"), updateUser)

// @route   DELETE /users/
// @desc    Delete user
// @access  Private

router.delete("/", verifyLogin, deleteUser)

// @route   PATCH /users/
// @desc    Change password
// @access  Private

router.patch("/", verifyLogin, Validator("password"), changePassword)

export default router
