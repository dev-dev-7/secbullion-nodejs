import { REQUEST_LOGIN_FIELDS, REQUEST_REGISTER_FIELDS } from "./auth.dto.js";
import lodash from "lodash";
import authService from "./auth.service.js";
import catchAsync from "../../helpers/catchAsync.js";
import { failed, succeed } from "../../helpers/api.response.js";
import {
  MESSAGE_AUTH_ERROR,
  MESSAGE_AUTH_SUCCESS,
} from "../../constants/message.constant.js";

const protect = catchAsync(async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return res.status(401).json(failed(MESSAGE_AUTH_ERROR.UNAUTHORIZED));
    }

    // 2) Verification token
    const verifyAccessTokenResult = await jwtToken.verifyAccessToken(token);

    if (!verifyAccessTokenResult.success) {
      return res.status(401).json(failed(verifyAccessTokenResult.message));
    }

    const decoded = verifyAccessTokenResult.data;

    // 3) Check if user still exists
    const currentUser = await userService.getById(decoded.id);
    if (!currentUser.success) {
      return res.status(401).json(failed(MESSAGE_AUTH_ERROR.TOKEN_INVALID));
    }

    // 4) Check if user changed password after the token was issued
    // if (currentUser.changedPasswordAfter(decoded.iat)) {
    //   return next(
    //     res
    //       .status(401)
    //       .json(failed(MESSAGE_AUTH_ERROR.TOKEN_CHANGE_PASSWORD_AFTER))
    //   );
    // }

    req.user = currentUser.data;

    next();
  } catch (err) {
    console.error(err);
    return next(res.status(401).json(failed(err.message)));
  }
});

// ********************************************************************

const login = async (req, res) => {
  try {
    var loginUser = lodash.pick(req.body, REQUEST_LOGIN_FIELDS);

    const result = await authService.login(loginUser);

    if (!result.success) {
      return res.status(401).json(failed(MESSAGE_AUTH_ERROR.LOGIN));
    }

    return res
      .status(200)
      .json(succeed(result.data, MESSAGE_AUTH_SUCCESS.LOGIN));
  } catch (error) {
    console.log(error);
    return res.status(500).json(failed(error.message));
  }
};

// *************************************************************************************

const register = async (req, res) => {
  try {
    var registerUser = lodash.pick(req.body, REQUEST_REGISTER_FIELDS);

    const result = await authService.register(registerUser);

    if (!result.success) {
      return res.status(400).json(failed(result.message));
    }

    return res.status(201).json(succeed(result.message));
  } catch (error) {
    console.log(error);
    return res.status(500).json(failed(error.message));
  }
};

// *************************************************************************************

const authController = {
  login,
  register,
  protect,
};

export default authController;
