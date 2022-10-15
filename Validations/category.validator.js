import Joi from "joi"
import JoiObjectId from "joi-objectid"

const myJoiObjectId = JoiObjectId(Joi)

const categorySchema = Joi.object({
    categoryName: Joi.string().required().min(7).max(30)
})

export default categorySchema