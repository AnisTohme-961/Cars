import Car from "../model/car.js"
import createError from "../util/Error"

export const getCars = async (req, res, next) => {
  const currentCarPage = req.query.page || 1
  const carperPage = 2
  try {
    const cars = await Car.find({})
      .sort({ createdAt: -1 })
      .skip((currentCarPage - 1) * carperPage)
      .limit(carperPage)
    if (!cars) {
      return next(createError("Cars not Found", 404))
    }
    res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      cars: cars,
      count: cars.length,
    })
  } catch (error) {
    next(error)
  }
}

