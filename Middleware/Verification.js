import jwt from "jsonwebtoken"
import createError from "../util/Error.js"

export const verifyLogin = async (req, res, next) => {
  let token = null
  try {
    const headers = req.headers.authorization
    if (headers == undefined) {
      return next(createError("Token not found", 401))
    }
    token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    if (!decodedToken) {
      return next(createError("Token invalid", 401))
    }
    if (decodedToken.exp < Date.now() / 1000) {
      return next(createError("Token expired", 401))
    }
    req.user = decodedToken
    next()
  } catch (error) {
    next(error)
  }
}
