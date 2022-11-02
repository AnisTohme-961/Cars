import Joi from "joi"

const passwordValidator = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/

const passwordSchema = Joi.object({
  oldPassword: Joi.string().required().pattern(passwordValidator),
  newPassword: Joi.string().required().pattern(passwordValidator),
})

export default passwordSchema