import mongoose from "mongoose"
import Car from "../models/car.js"
import User from "../models/user.js"
import createError from "../util/Error.js"
import car from "../models/car.js"
import category from "../models/category.js"

export const getCars = async (req, res, next) => {
  const currentCarPage = req.query.page || 1
  const carPerPage = 2
  try {
    const cars = await Car.find({})
      .sort({ createdAt: -1 })
      .skip((currentCarPage - 1) * carPerPage)
      .limit(carPerPage)
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
  if (!key || key === "id") {
    key = "_id"
  }

  try {
    const cars = await Car.find({ [key]: value })
    if (!cars || cars.length === 0) {
      return next(createError("Cars not found", 404))
    }
    res.status(200).json({
      success: true,
      message: "Car by search fetched successfully",
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
          $minDistance: 10000,
          distanceField: "dist.calculated",
          spherical: true,
          key: "geometry.coordinates",
          distanceMultiplier: 0.001,
        },
      },
      {
        $match: { // case where if we want to obtain the distance greater than zero. (Not the same car coordinates when passed to url)
          "dist.calculated": {$gt: 0}
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          tempDoc: {
            carDetails: {
              carName: "$carName",
              owner: {
                $concat: ["$user.firstName", " ", "$user.lastName"]
              }
            },
            geometry: {
              type: "$geometry.type",
              coordinates: "$geometry.coordinates",
            },
            dist: "$dist",
          },
        },
      },
      {
        $project: {
          _id: 0,
          carDetails: "$tempDoc.carDetails",
          geometry: "$tempDoc.geometry",
          dist: "$tempDoc.dist",
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "Distances calculated for cars",
      cars: carsCoordinates,
    })
  } catch (error) {
    next(error)
  }
}

// export const groupCarsByCategories = async (req, res, next) => {
//   try {
//     const cars = await Car.aggregate([
//       {
//         $lookup: {
//           from: "categories",
//           localField: "categoryId",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       {
//         $unwind: "$category",
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "category.owner",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },
//       {
//         $group: {
//           _id: {
//             _id: "$_id",
//             carName: "$carName",
//             owner: {
//               id: "$user._id",
//               fullname: { $concat: ["$user.firstName", " ", "$user.lastName"] },
//             },
//           },
//           categories: {
//             $push: "$category",
//           },
//         },
//       },
//       {
//         $project: {
//           carName: 1,
//           category: {
//             id: { $arrayElemAt: ["$categories._id", 0] },
//             name: { $arrayElemAt: ["$categories.categoryName", 0] },
//           },
//         },
//       },
//     ])
//     res.status(200).json({
//       success: true,
//       message: "Cars fetched successfully grouped by categories",
//       cars: cars,
//     })
//   } catch (error) {
//     next(error)
//   }
// }
export const groupCarsByCategories = async (req, res, next) => {
  try {
    const cars = await Car.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $lookup: {
          from: "users",
          localField: "category.owner",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $group: {
          _id: {
            category: "$category.categoryName",
          },
          cars: {
            $push: {
              carName: "$carName",
              owner: {
                id: "$user._id",
                fullname: {
                  $concat: ["$user.firstName", " ", "$user.lastName"],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id.category",
          cars: 1,
        },
      },
    ])

    res.status(200).json({
      success: true,
      message: "Cars fetched successfully grouped by categories",
      cars: cars,
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
    const result = await Car.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(carId) },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          carName: 1,
          category: {
            id: "$category._id",
            name: "$category.categoryName",
          },
        },
      },
    ])
    res.status(200).json({
      success: true,
      message: "Car fetched successfully",
      car: result[0],
    })
  } catch (error) {
    next(error)
  }
}

export const getCarWithTags = async (req, res, next) => {
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
          carId: { $first: "$_id" },
          tags: { $push: "$tags" },
        },
      },
      {
        $project: {
          _id: "$carId",
          carName: "$_id",
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

export const addCar = async (req, res, next) => {
  const { carName, carImage, owner, categoryId, tags, geometry } = req.body
  const { id } = req.user
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
