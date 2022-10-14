export const createError = (message, code) => {
  const err = new Error()
  err.message = message
  err.code = code
  return err
}

export default createError
