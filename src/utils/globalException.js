import logger from '../core/config/logger.js'

const globalExceptionHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error!'
  const errorCode =
    err.errorCode || 'Something went wrong on our end. Please try again later.'
  const stack = process.env.NODE_ENV === 'production' ? null : err.stack

  console.error('hiiiiiiiiiiiiiii', err.stack)
  const { method, originalUrl, body, params, headers } = req
  // let statusCode = err.statusCode || 500;
  // let message = err.message || 'Internal Server Error';
  let error = err.stack || 'No stack trace available'
  const isOperational = err.isOperational || false
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
}

export default globalExceptionHandler
