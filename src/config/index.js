require("dotenv").config();

module.exports = {
  VERSION: "/v1",
  PORT: 4000,
  mysql: {
    host: "34.125.129.95",
    user: "root",
    password: "es5JfeAlwsqmf7ui",
    database: "cardz_ly",
    insecureAuth: true,
    dateStrings: true,
    charset: "utf8mb4",
  },
  development: {
    TWILIO_ACCOUNT_SID: "ACd9bf8506e15987f9987d0c5ec9066494",
    TWILIO_AUTH_TOKEN: "51907ee6a7fe3f9a6aaab6b0df0a1d5c",
    TWILIO_VERIFICATION_SERVICE_ID: "VA79b2abbc3b8a08443daa518a9ae437e5",
    TWILIO_PHONE_NUMBER: "+19125135450",
  },
  production: {},
};
