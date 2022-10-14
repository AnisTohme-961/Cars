import Joi from "joi"

const passwordValidator = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&? "])[a-zA-Z0-9!#$@^%&?]{8,20}$/

const signupSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(30),
  lastName: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(passwordValidator),
})

export default signupSchema