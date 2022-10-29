import dotenv from "dotenv";

// Load .env file
dotenv.config();

const config = {
  app: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    PORT: process.env.PORT,
  },
  mail: {
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  },

  mongodb: {
    MONGO_DB_URI_PRO: process.env.MONGO_DB_URI_PRO,
    MONGO_DB_URI_DEV: process.env.MONGO_DB_URI_DEV,
    MONGO_DB_USER_NAME: process.env.MONGO_DB_USER_NAME,
    MONGO_DB_PASSWORD: process.env.MONGO_DB_PASSWORD,
  },

  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  google_storage: {
    BUCKET_NAME: process.env.BUCKET_NAME,
    GOOGLE_CLOUD_KEY_FILE: process.env.GOOGLE_CLOUD_KEY_FILE,
    LIMIT_FILE_SIZE: process.env.LIMIT_FILE_SIZE,
  },
  stripe: {
    STRIPE_PUBLISH_KEY: process.env.STRIPE_PUBLISH_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  sendgrid: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },
  sms_global: {
    OTP_EXPIRED_AFTER: process.env.OTP_EXPIRED_AFTER,
    OTP_DURATION_UNIT: process.env.OTP_DURATION_UNIT,
    SMSGLOBAL_API_KEY: process.env.SMSGLOBAL_API_KEY,
    SMSGLOBAL_API_SECRET: process.env.SMSGLOBAL_API_SECRET,
  },
  oauth: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  },
};

export default config;
