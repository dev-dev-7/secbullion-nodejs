import jwt from "jsonwebtoken";
import config from "../config/index.js";
failed;
import { promisify } from "util";
import { failed, succeed } from "./api.response.js";
import { MESSAGE_AUTH_ERROR } from "../constants/message.constant.js";

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = config.jwt;

// **********************************************************************

const generateAccessToken = async (payload) => {
  try {
    // create access token
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    return succeed(accessToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};
// **********************************************************************

const verifyAccessToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, ACCESS_TOKEN_SECRET);
    return succeed(decoded);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_EXPIRED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_INVALID);
    }
    console.error(error);
    return failed(error.message);
  }
};

// **********************************************************************

const generateRefreshToken = async (payload) => {
  try {
    // create refresh token
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
    return succeed(refreshToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// **********************************************************************

const verifyRefreshToken = async (token) => {
  try {
    const decoded = await promisify(jwt.verify)(token, REFRESH_TOKEN_SECRET);
    return succeed(decoded);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_EXPIRED);
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_INVALID);
    }
    console.error(error);
    return failed(error.message);
  }
};

const jwtTokenService = {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};

export default jwtTokenService;
