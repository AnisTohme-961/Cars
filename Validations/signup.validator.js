import Joi from "joi"

const passwordValidator = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/

const signupSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(30),
  lastName: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(passwordValidator),
  role: Joi.string().valid("user", "admin")
})

export default signupSchema