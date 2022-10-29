import jwtTokenService from "../../helpers/jwtToken.service.js";
import userService from "../user/user.service.js";
import { RefreshToken } from "./auth.model.js";
import {
  MESSAGE_COMMON_ERROR,
  MESSAGE_AUTH_ERROR,
} from "../../constants/message.constant.js";
import { failed, succeed } from "../../helpers/api.response.js";
import { ACCESS_TOKEN_PAYLOAD } from "./auth.dto.js";
import lodash from "lodash";

// *******************************************************

const getRefreshTokenByToken = async ({ token, user_id }) => {
  try {
    const refreshToken = await RefreshToken.findOne({ token, user_id });
    if (!refreshToken) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(refreshToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// *******************************************************

const getRefreshTokenByUserId = async (user_id) => {
  try {
    const refreshToken = await RefreshToken.findOne({ user_id });
    if (!refreshToken) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(refreshToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// *******************************************************

const createRefreshToken = async ({ user_id, token }) => {
  try {
    const refreshToken = await RefreshToken.create({ user_id, token });
    if (!refreshToken) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(refreshToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// *******************************************************

const updateRefreshTokenByUserId = async ({ user_id, token }) => {
  try {
    const filter = { user_id };
    const update = { token };
    const refreshToken = await RefreshToken.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true, // Make this update into an upsert
    });
    if (!refreshToken) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(refreshToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// *******************************************************
const deleteRefreshTokenByUserId = async ({ user_id }) => {
  try {
    const filter = { user_id };
    const refreshToken = await RefreshToken.findOneAndDelete(filter);
    console.log(refreshToken);
    if (!refreshToken) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(refreshToken);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// *******************************************************

const renewRefreshToken = async (old_token) => {
  try {
    const verifyResult = await jwtTokenService.verifyRefreshToken(old_token);

    if (!verifyResult.success) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_INVALID);
    }

    const refreshTokenResult = await getRefreshTokenByToken({
      token: old_token,
      user_id: verifyResult.data.id,
    });

    if (!refreshTokenResult.success) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_INVALID);
    }

    const userResult = await userService.getById(verifyResult.data.id);

    if (!userResult.success) {
      return failed(MESSAGE_AUTH_ERROR.TOKEN_INVALID);
    }

    const payload = lodash.pick(userResult.data, ACCESS_TOKEN_PAYLOAD);

    const accessTokenResult = await jwtTokenService.generateAccessToken(
      payload
    );

    if (!accessTokenResult.success) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed({ access_token: accessTokenResult.data });
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

const refreshTokenService = {
  getRefreshTokenByToken,
  getRefreshTokenByUserId,
  createRefreshToken,
  updateRefreshTokenByUserId,
  deleteRefreshTokenByUserId,
  renewRefreshToken,
};

export default refreshTokenService;
