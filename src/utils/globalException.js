import logger from '../core/config/logger.js'

const globalExceptionHandler = (err, req, res, next) => {
  const statusCode = err?.statusCode || 500
  const message = err?.message || 'Internal Server Error!'
  const errorCode =
    err?.errorCode || 'Something went wrong on our end. Please try again later.'

  console.error('error stack', err.stack)
  const { method, originalUrl, body, params, headers } = req
  let error = err?.stack || 'No stack trace available'
  const logMessage = `
    Method: ${method}
    URL: ${originalUrl}
    Params: ${JSON.stringify(params)}
    Body: ${JSON.stringify(body)}
    Headers: ${JSON.stringify(headers)}
    Error: ${message}
    Stack: ${error}
  `
  logger.error(logMessage)

  res.status(statusCode).json({
    status: 'error',
    message,
    errorCode,
  })
  next()
}

export default globalExceptionHandler
