const responseInterceptor = (req, res, next) => {
  const oldSend = res.json

  res.json = (data) => {
    if (data && data?.status && data?.status === 'error') {
      const formattedResponse = {
        success: false,
        data: {},
        message: data?.message || 'Error occurred',
        error: data?.errorCode || data?.message || 'Unknown Error',
        timestamp: new Date().toISOString(),
      }
      console.log('formattedResponse', formattedResponse)
      oldSend.call(res, formattedResponse)
    } else {
      const formattedResponse = {
        success: true,
        data: data || {},
        message: data?.message || 'Success',
        error: null,
        timestamp: new Date().toISOString(),
      }
      oldSend.call(res, formattedResponse)
    }
  }

  res.error = (error, statusCode = 500, message = 'Internal Server Error') => {
    const formattedResponse = {
      success: false,
      data: {},
      message,
      error: error || message,
      timestamp: new Date().toISOString(),
    }

    res.status(statusCode).json(formattedResponse)
  }

  next()
}

export default responseInterceptor
