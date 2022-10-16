import User from "../models/user.js"
import bcrypt from "bcrypt"
import createError from "../util/Error.js"

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password -token -createdAt -updatedAt")
    if (users.length <= 0) {
      return next(createError("Users not found", 404))
    }
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: users,
      count: users.length,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
      return next(createError(`User not found with id ${userId} `, 404))
    }
    res.status(200).json({
      success: true,
      message: "User found successfully",
      user: user,
    })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  const { id } = req.user
  const { firstName, lastName } = req.body
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName },
      { new: true }
    )
    if (!user) {
      return next(createError(`User not found with id ${id}`, 404))
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: user,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  const { id } = req.user
  try {
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return next(createError(`User not found with id ${id}`, 404))
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  const { id } = req.user
  const { oldPassword, newPassword } = req.body
  try {
    const user = await User.findById(id)
    if (!user) {
      return next(createError(`User not found with id ${id}`, 404))
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return next(createError("Old password is incorrect", 400))
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    user.password = hashedPassword
    await user.save()
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    next(error)
  }
}
