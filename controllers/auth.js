import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import User from "../model/user.js"
import createError from "../util/Error.js"
import generateToken from "../util/Token.js"

let transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
})

export const signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body
  const hashPassword = await bcrypt.hash(password, 12)
  try {
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      role: role
    })
    const result = await user.save()
    res.status(201).json({
      message: "SignUp Successful",
      data: result,
    })
    const sentMail = await transporter.sendMail({
      to: email,
      from: "carapp@euriskomobility.com",
      subject: "SignUp Succeeded",
      html: "<h1>You signed up successfully</h1>",
    })
    res.status(250).json({
      message: "Requested mail sent to the registered user",
      sentMail: sentMail,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  const { email, password } = req.body
  try {
    const user = User.findOne({ email: email })
    if (!user) {
      return next(createError("User not found", 404))
    }
    const isEqual = await bcrypt.compareSync(password, user.password)
    if (!isEqual) {
      return next(createError("Invalid password", 401))
    }

    const { accessToken, refreshToken } = generateToken(user)
    const { _id } = user
    await User.findOneAndUpdate({ _id }, { token: refreshToken }) // refresh token added to db
    const { token, ...userData } = user._doc // _doc removes refresh token from data
    res.status(200).json({
      success: true,
      message: `${user.firstName} + ${user.lastName} logged in successfully.`,
      user: userData,
    })
  } catch (error) {
    next(error)
  }
}
