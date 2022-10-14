import express from "express"
import { login, signUp } from "../controllers/auth.js"

const router = express.Router()

// @route   POST /auth/signup
// @desc    User sign up
// @access  Private

router.post("/signup", signUp)

// @route   POST /auth/login
// @desc    User login
// @access  Private

router.post("/login", login)

export default router