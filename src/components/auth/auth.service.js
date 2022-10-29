import { failed, succeed } from "../../helpers/api.response.js";
import {
  MESSAGE_AUTH_ERROR,
  MESSAGE_AUTH_SUCCESS,
  MESSAGE_COMMON_ERROR,
} from "../../constants/message.constant.js";
import userService from "../user/user.service.js";
import jwtTokenService from "../../helpers/jwtToken.service.js";
import Hash from "../../helpers/Hash.js";
import refreshTokenService from "./refreshToken.service.js";
import lodash from "lodash";
import { RESPONSE_LOGIN_FIELDS } from "./auth.dto.js";

// *******************************************************

const register = async (user) => {
  try {
    const result = await userService.getByEmail(user.email);

    if (result.success) {
      return failed(MESSAGE_AUTH_ERROR.USER_EXISTS);
    }

    const createdUser = await userService.create(user);

    if (!createdUser) {
      return failed(MESSAGE_AUTH_ERROR.SIGNUP);
    }

    return succeed(createdUser, MESSAGE_AUTH_SUCCESS.SIGNUP);
  } catch (error) {
    console.error(error);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};

// *******************************************************

const login = async ({ email, password }) => {
  try {
    const result = await userService.getByEmailWithPassword(email);

    if (!result.success) {
      return failed(MESSAGE_AUTH_ERROR.LOGIN);
    }

    if (result.data.role == Role.ADMIN) {
    }

    if (result.success) {
      if (Hash.check(password, result.data?.password)) {
        const tokens = await generateTokens(result.data);

        const user = lodash.pick(result.data, RESPONSE_LOGIN_FIELDS);
        return succeed({ user, tokens: tokens.data });
      }
    }

    return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
  } catch (error) {
    console.error(error);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};
// *******************************************************

const logout = async ({ user_id }) => {
  try {
    const result = await refreshTokenService.deleteRefreshTokenByUserId({
      user_id,
    });

    if (result.success || result.message == MESSAGE_COMMON_ERROR.NOT_FOUND) {
      return succeed(null, MESSAGE_AUTH_SUCCESS.LOGOUT);
    }

    return failed(MESSAGE_COMMON_ERROR.WRONG);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// *******************************************************

const generateTokens = async (user) => {
  try {
    const payload = { id: user._id, role: user.role, email: user.email };

    const accessTokenResult = await jwtTokenService.generateAccessToken(
      payload
    );
    if (!accessTokenResult.success) {
      return fail(accessTokenResult.message);
    }
    const refreshTokenResult = await jwtTokenService.generateRefreshToken(
      payload
    );
    if (!refreshTokenResult.success) {
      return fail(refreshTokenResult.message);
    }

    await refreshTokenService.updateRefreshTokenByUserId({
      user_id: user._id,
      token: refreshTokenResult.data,
    });

    return succeed({
      access_token: accessTokenResult.data,
      refresh_token: refreshTokenResult.data,
    });
  } catch (error) {
    console.error(error);
    return fail(error.message);
  }
};

const authService = { register, login, logout };

export default authService;
