import mongoose from "mongoose"
import Car from "../models/car.js"
import User from "../models/user.js"
import createError from "../util/Error.js"
import car from "../models/car.js"

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

export const searchCars = async (req, res, next) => {
  const { key, value } = req.query
  if (!key || key == "id") {
    key == "_id"
  }
  try {
    const cars = await Car.find({ [key]: value })
    if (!cars) {
      return next(createError("Cars not found", 404))
    }
    res.status(200).json({
      success: true,
      message: "Cars fetched successfully",
      data: cars,
    })
  } catch (error) {
    next(error)
  }
}

export const searchCarsByTags = async (req, res, next) => {
  const { tags } = req.query
  const tagsArray = tags.split(",")
  try {
    const cars = await Car.find({ tags: { $in: tagsArray } })
    if (!cars) {
      return next(createError("Cars not found", 404))
    }
    res.status(200).json({
      success: true,
      message: "Cars searched by tags fetched successfully",
      data: cars,
    })
  } catch (error) {
    next(error)
  }
}

export const getCarsByCoordinates = async (req, res, next) => {
  try {
    const carsCoordinates = await Car.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          distanceField: "dist.calculated",
          maxDistance: 100000,
          spherical: true,
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "Cars with their respective coordinates",
      cars: carsCoordinates,
    })
  } catch (error) {
    next(error)
  }
}

export const getCarById = async (req, res, next) => {
  try {
    const carId = req.params.carId
    const car = await Car.findById(carId)
    if (!car) {
      return next(createError("Car not found", 404))
    }
    const carAggregate = await Car.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(carId) },
      },
      {
        $group: {
          _id: {
            id: "$_id",
            carName: "$carName",
            carImage: "$carImage",
            owner: "$owner",
            tags: "$tags",
            geometry: "$geometry",
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          category: {
            id: "$category._id",
            name: "$category.categoryName",
          },
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "Car found successfully",
      car: carAggregate[0],
    })
  } catch (error) {
    next(error)
  }
}

export const getCarsWithTags = async (req, res, next) => {
  try {
    const { carId } = req.params
    const car = await Car.findById(carId)
    const carwithTags = await Car.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(carId) },
      },
      {
        $unwind: { path: "$tags", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: "$carName",
          tags: { $push: "$tags" },
        },
      },
      {
        $project: {
          carName: 1,
          tags: 1,
          numberofTags: {
            $cond: {
              if: { $isArray: "$tags" },
              then: { $size: "$tags" },
              else: "Not Applicable",
            },
          },
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "Car with the appropriate tags:",
      car: carwithTags[0],
    })
  } catch (error) {
    next(error)
  }
}

export const createCar = async (req, res, next) => {
  const { carName, carImage, owner, categoryId, tags, geometry } = req.body
  const { id }  = req.user
  try {
    const existingCar = await Car.findOne({ carName })
    if (existingCar) {
      return next(createError("Car already exists", 400))
    }
    const car = new Car({
      carName: carName,
      carImage: carImage,
      owner: id,
      categoryId: categoryId,
      tags: tags,
      geometry: geometry,
    })
    await car.save()
    const user = await User.findById(id)
    user.cars.push(car._id)
    await user.save()
    res.status(201).json({
      success: true,
      message: "Car created successfully",
      car: car,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCar = async (req, res, next) => {
  const carId = req.params.carId
  const { id } = req.user
  const { carName, tags } = req.body
  try {
    const car = await Car.findById(carId)
    if (!car) {
      return next(createError(`Car not found with id ${carId}`, 404))
    }
    if (car.owner.toString() !== id) {
      return next(createError("User not authorized", 403))
    }
    car.carName = carName
    car.tags = tags
    await car.save()
    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      car: car,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCar = async (req, res, next) => {
  const carId = req.params.carId
  const { id } = req.user
  try {
    const car = await Car.findById(carId)
    if (!car) {
      return next(createError(`Car not found with id ${carId}`, 404))
    }
    if (car.owner.toString() !== id) {
      return next(createError("User not authorized", 403))
    }
    const deleteCar = await Car.findByIdAndDelete(carId)
    const user = await User.findById(id)
    user.cars.pull(car._id)
    await user.save()
    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
      car: deleteCar,
    })
  } catch (error) {
    next(error)
  }
}
