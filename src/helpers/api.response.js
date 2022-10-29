// *********************************************************

/**
 * @desc    Send any success response
 *
 * @param   {object | array} data
 * @param   {string} message
 */
export const succeed = (data, message) => {
  return {
    success: true,
    message: message,
    data: data,
  };
};

// *********************************************************

/**
 * @desc    Send any fail response
 *
 * @param   {string} message
 * @param   {string} error
 * @default message= "Some error occurred."
 */
export const failed = (message = "something went wrong.", error) => {
  //   // List of common HTTP request code
  //   const codes = [200, 201, 400, 401, 404, 403, 422, 500];

  //   // Get matched code
  //   const findCode = codes.find((code) => code == statusCode);

  //   if (!findCode) statusCode = 500;
  //   else statusCode = findCode;

  return {
    success: false,
    message,
    error,
  };
};

// *********************************************************

/**
 *
 * @desc    Send any validation response
 *
 * @param   {object | array} errors
 */
export const invalidated = (errors) => {
  return {
    success: false,
    message: "Validation Errors",
    errors: parseErrors(errors),
  };
};

const parseErrors = (validationErrors) => {
  let errors = [];
  validationErrors.forEach((error) => {
    // console.log(error);
    errors.push({
      message: error.message,
    });
  });

  return errors;
};
