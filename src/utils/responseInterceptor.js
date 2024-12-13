const responseInterceptor = (req, res, next) => {
  const oldSend = res.json;

  res.json = (data) => {
    if (data && data.status && data.status === "error") {
      const formattedResponse = {
        success: false,
        data: {},
        message: data.message || "Error occurred",
        error: data.errorCode || data.message || "Unknown Error",
        timestamp: new Date().toISOString(),
      };
      console.log("formattedResponse", formattedResponse);
      oldSend.call(res, formattedResponse);
    } else {
      const formattedResponse = {
        success: true,
        data: data || {},
        message: data.message || "Success",
        error: null,
        timestamp: new Date().toISOString(),
      };
      oldSend.call(res, formattedResponse);
    }
  };

  res.error = (error, statusCode = 500, message = "Internal Server Error") => {
    const formattedResponse = {
      success: false,
      data: {},
      message,
      error: error || message,
      timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json(formattedResponse);
  };

  next();
};

export default responseInterceptor;

// ---------------------------------------------------

// const responseInterceptor = (req, res, next) => {
//     const oldSend = res.send;
//     const oldJson = res.json;
//     const oldCookie = res.cookie;

//     console.log("oldSend---", oldSend);
//     console.log("oldJson---", oldJson);
//     console.log("oldCookie---", oldCookie);

//     res.json = (data) => {
//         console.log("data================<<<<<<<<<", data);

//         if (data && data.status && data.status === 'error') {
//             const formattedResponse = {
//                 success: false,
//                 data: {},
//                 message: data.message || "Error occurred",
//                 error: data.errorCode || data.message || "Unknown Error",
//                 timestamp: new Date().toISOString(),
//             };
//             oldJson.call(res, formattedResponse);
//         } else {
//             const formattedResponse = {
//                 success: true,
//                 data: data || {},
//                 message: data.message || "Success",
//                 error: null,
//                 timestamp: new Date().toISOString(),
//             };
//             oldJson.call(res, formattedResponse);
//         }
//     };

//     res.send = (data) => {
//         console.log("data================>>>>>>", data);

//         if (data && typeof data === 'object') {
//             res.json(data);
//         } else {
//             oldSend.call(res, data);
//         }
//     };

//     res.cookie = (name, value, options) => {
//         console.log(`Setting cookie ${name}`);
//         oldCookie.call(res, name, value, options);
//     };

//     res.error = (error, statusCode = 500, message = "Internal Server Error") => {
//         const formattedResponse = {
//             success: false,
//             data: {},
//             message,
//             error: error || message,
//             timestamp: new Date().toISOString(),
//         };
//         res.status(statusCode).json(formattedResponse);
//     };

//     next();
// };

// export default responseInterceptor;
