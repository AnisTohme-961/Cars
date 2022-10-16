import Joi from "joi"
import JoiObjectId from "joi-objectid"

const myJoiObjectId = JoiObjectId(Joi)

const carSchema = Joi.object({
  carName: Joi.string().required().min(3).max(30),
  carImage: Joi.string().required(),
  categoryId: myJoiObjectId("Category"),
  tags: Joi.array().items(Joi.string()),
  geometry: Joi.object()
})

export default carSchema