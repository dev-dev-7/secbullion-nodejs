export const MESSAGE_AUTH_SUCCESS = {
  SIGNUP: "Sign Up successfully",
  LOGIN: "Logged in successfully!",
  LOGOUT: "Logged out successfully!",
  UPDATE_PASSWORD: "Password updated successfully",
  RESET_PASSWORD_EMAIL_LINK: "password reset link sent to your email account",
  RESET_PASSWORD_OTP_CODE: "password reset OTP Code sent to your mobile number",
  OTP_VALID: "OTP Valid",
};

// *******************************************

export const MESSAGE_AUTH_ERROR = {
  SIGNUP: "Sign Up failed",
  LOGIN: "Invalid credentials!",
  USER_EXISTS: "User with this email already exists",
  UNAUTHORIZED: "401 Unauthorized",
  UPDATE_PASSWORD: "Failed to update password ",
  TOKEN_CHANGE_PASSWORD_AFTER:
    "User recently changed password! Please log in again.",
  TOKEN_INVALID: "Invalid Token",
  TOKEN_EXPIRED: "Token is Expired, please login again",
  OTP_INVALID: "OTP Code Invalid",
  OTP_EXPIRED: "OTP Code Expired",
  OTP_VERIFIED_BEFORE: "OTP Code already used ,please try another otp code",
};
// *******************************************

export const MESSAGE_USER_ERROR = {
  NOT_FOUND: "User not found!",
  LOGIN: "Login failed!",
  USER_EXISTS: "User with this email already exists",
};

// *******************************************

export const MESSAGE_CRUD_SUCCESS = {
  GET_SUCCESS: "Item retrived successfully.",
  GET_LIST_SUCCESS: "Items retrived successfully.",
  CREATE_SUCCESS: "Item created successfully.",
  UPDATE_SUCCESS: "Item updated successfully.",
  DELETE_SUCCESS: "Item deleted successfully.",
};

// *******************************************

export const MESSAGE_COMMON_ERROR = {
  NOT_FOUND: "item not found",
  WRONG: "something went wrong!",
};

// *******************************************

export const MESSAGE_RESET_PASSWORD_SUCCESS = {
  UPDATE_SUCCESS: "Item updated successfully.",
};
// *******************************************

export const MESSAGE_RESET_PASSWORD_ERROR = {
  SECRET_HASH_INVALID: "Secret Hash Invalid",
};

// *******************************************

// module.exports = {
//   MESSAGE_AUTH_SUCCESS,
//   MESSAGE_AUTH_ERROR,
//   MESSAGE_USER_ERROR,
//   MESSAGE_CRUD_SUCCESS,
//   MESSAGE_COMMON_ERROR,
//   MESSAGE_RESET_PASSWORD_SUCCESS,
//   MESSAGE_RESET_PASSWORD_ERROR,
// };
