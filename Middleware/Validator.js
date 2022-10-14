import Validators from "../Validations/index.js"

const Validator = (validator) => {
  return (req, res, next) => {
    try {
      const { error } = Validators[validator].validate(req.body)
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.details[0].message,
        })
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default Validator
