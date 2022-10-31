require("dotenv").config();

module.exports = {
  VERSION: "/v1",
  PORT: 8080,
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
    JWT_SECRETE_KEY: "1v96QzgeoywikzrizoK0FFq69iVekU",
    xoxodayAPI: "https://stagingaccount.xoxoday.com/chef",
    refresh_token: "2b281fee889d3a5dbc1be232b4086d3b699fbae7",
    client_secret: "e62z0ddcsfj28yij6t6iqmd8tr9g3m2w2r52wxc",
    client_id: "573030173f3f3fff12b58db0fe45ffe6",
    TWILIO_ACCOUNT_SID: "ACd9bf8506e15987f9987d0c5ec9066494",
    TWILIO_AUTH_TOKEN: "51907ee6a7fe3f9a6aaab6b0df0a1d5c",
    TWILIO_VERIFICATION_SERVICE_ID: "VA79b2abbc3b8a08443daa518a9ae437e5",
    TWILIO_PHONE_NUMBER: "+19125135450",
  },
  production: {
    xoxodayAPI: "https://xoxoday.com/chef",
    refresh_token: "2b281fee889d3a5dbc1be232b4086d3b699fbae7",
    client_secret: "e62z0ddcsfj28yij6t6iqmd8tr9g3m2w2r52wxc",
    client_id: "573030173f3f3fff12b58db0fe45ffe6",
  },
};
