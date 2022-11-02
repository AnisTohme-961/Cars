import express from "express"
import { login, signUp } from "../controllers/auth.js"
import Validator from "../Middleware/Validator.js"

const router = express.Router()

// @route   POST /auth/signup
// @desc    User sign up
// @access  Private

router.post("/signup", Validator("signup"), signUp)

// @route   POST /auth/login
// @desc    User login
// @access  Private

router.post("/login", Validator("login"), login)

export default router