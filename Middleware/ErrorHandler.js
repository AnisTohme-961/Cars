const ErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Error found"
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV !== "development" ? {} : err.stack,
  })
}

export default ErrorHandler
