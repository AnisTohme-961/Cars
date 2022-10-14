import jwt from "jsonwebtoken"

export const generateToken = (user) => {
  const { _id, email } = user
  const accessToken = jwt.sign({ id: _id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  })

  const refreshToken = jwt.sign({ id: _id, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  })

  return { accessToken, refreshToken }
}

export default generateToken