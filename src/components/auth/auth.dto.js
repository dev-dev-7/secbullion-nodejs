export const REQUEST_REGISTER_FIELDS = [
  "full_name",
  "email",
  "mobile",
  "country_code",
  "password",
  "address",
  "image",
];

// *********************************************

export const RESPONSE_REGISTER_FIELDS = [
  "full_name",
  "email",
  "mobile",
  "address",
  "image",
];
// *********************************************

export const REQUEST_LOGIN_FIELDS = ["email", "password"];

// *********************************************

export const RESPONSE_LOGIN_FIELDS = [
  "full_name",
  "email",
  "mobile",
  "address",
  "image",
];

export const REQUEST_OTP_FIELDS = ["otp_code"];

// ****************************************************************

export const ACCESS_TOKEN_PAYLOAD = ["_id", "full_name", "email", "role"];

// ***************************************************************
// RESET_PASSWORD

export const REQUEST_RESET_PASSWORD_FIELDS = ["mobile_number"];

export const REQUEST_UPDATE_PASSWORD_FIELDS = ["password", "secret_hash"];
