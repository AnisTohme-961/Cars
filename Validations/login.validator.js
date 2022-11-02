import Joi from "joi"

const passwordValidator = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().pattern(passwordValidator),
})

export default loginSchema
