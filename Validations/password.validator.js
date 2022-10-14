import Joi from "joi"

const passwordValidator = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$@^%&? "])[a-zA-Z0-9!#$@^%&?]{8,20}$/

const passwordSchema = Joi.object({
  oldPassword: Joi.string().required().pattern(passwordValidator),
  newPassword: Joi.string().required().pattern(passwordValidator),
})

export default passwordSchema