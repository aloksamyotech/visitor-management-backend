class CustomError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    errorCode = 'UNKNWON_ERROR',
    errors = [],
    isOperational = true,
    stack = ''
  ) {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.errors = errors
    this.errorCode = errorCode
    this.isOperational = isOperational
    this.stack = stack || new Error().stack
    Error.captureStackTrace(this, this.constructor)
  }
}

export default CustomError
