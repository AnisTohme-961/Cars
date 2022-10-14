import Joi from "joi"

const passwordValidator = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&? "])[a-zA-Z0-9!#$@^%&?]{8,20}$/

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(passwordValidator),
})

export default loginSchema
