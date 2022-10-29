const crypto = require("crypto");
const userService = require("../users/user.service");
const { ResetPasswordToken } = require("./auth.model");
const serviceFactory = require("../utils/serviceFactory.util");
const config = require("../config");
const dayjs = require("dayjs");
// const { failed, succeed } = require("../utils/responseApi");
const Hash = require("../helpers/Hash");
const { success, fail } = require("../utils/serviceResponse.util");
const {
  MESSAGE_COMMON_ERROR,
  MESSAGE_AUTH_ERROR,
  MESSAGE_AUTH_SUCCESS,
  MESSAGE_RESET_PASSWORD_ERROR,
} = require("../constants/message.constant");
const { sendSMS } = require("../utils/sendSMS.util");

const { BASE_URL } = config.app;
const { OTP_EXPIRED_AFTER, OTP_DURATION_UNIT } = config.sms_global;

// const { SMSGLOBAL_API_KEY, SMSGLOBAL_API_SECRET } = config.sms_global;

// const smsglobal = require("smsglobal")(SMSGLOBAL_API_KEY, SMSGLOBAL_API_SECRET);

// *******************************************************

exports.create = serviceFactory.create(ResetPasswordToken);
exports.getById = serviceFactory.getById(ResetPasswordToken);
exports.delete = serviceFactory.remove(ResetPasswordToken);

// *******************************************************

exports.generateResetPasswordLink = async (email) => {
  try {
    const user = await userService.getByEmail(email);
    if (!user) {
      throw new Error("User with this email not found");
    }

    let token = {
      userId: user.id,
      token: crypto.randomBytes(32).toString("hex"),
    };
    // GENERATE LINK
    const link = `${BASE_URL}/update-password/${user._id}/${token.token}`;

    return link;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// *******************************************************

exports.generateOTPCode = async (mobile_number) => {
  try {
    const userResult = await userService.getByMobileNumber(mobile_number);

    if (!userResult.success) {
      return fail(userResult.message);
    }

    const otp_code = Math.floor(100000 + Math.random() * 900000);
    const secret_hash = crypto.randomBytes(32).toString("hex");

    let now = dayjs();

    const resetPasswordToken = {
      user_id: userResult.data._id,
      otp_code,
      secret_hash,
      verified_before: false,
      expire_at: now.add(OTP_EXPIRED_AFTER, OTP_DURATION_UNIT),
    };

    const result = await this.updateResetPasswordByUserId(resetPasswordToken);

    if (!result.success) {
      return fail(result.message);
    }

    var payload = {
      origin: "SMSGlobal",
      destination: mobile_number,
      message: "Welcome to Mazadee, Your OTP Code is " + otp_code,
    };

    const response = await sendSMS(payload);
    if (!response.success) {
      return fail(response.message);
    }

    return success({ otp_code });
  } catch (err) {
    console.error(err);
    return fail(err.message);
  }
};

// *******************************************************

exports.verifyOTPCode = async (data) => {
  try {
    const { otp_code } = data;
    const otpResult = await getByOTP(otp_code);

    if (!otpResult.success) {
      return fail(MESSAGE_AUTH_ERROR.OTP_INVALID);
    }

    const token = otpResult.data;

    if (token.verified_before) {
      await this.delete(token._id);
      return fail(MESSAGE_AUTH_ERROR.OTP_VERIFIED_BEFORE);
    }

    const isValid = dayjs().isBefore(dayjs(token.expire_at));
    if (!isValid) {
      await this.delete(token._id);
      return fail(MESSAGE_AUTH_ERROR.OTP_EXPIRED);
    }

    const filter = { _id: token._id };
    const update = { verified_before: true };
    await ResetPasswordToken.findOneAndUpdate(filter, update);

    return success(
      { secret_hash: token.secret_hash },
      MESSAGE_AUTH_SUCCESS.OTP_VALID
    );
  } catch (error) {
    console.error(error);
    return fail(error.message);
  }
};

// *******************************************************

exports.updatePassword = async ({ password, secret_hash }) => {
  try {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      secret_hash,
    });

    if (!resetPasswordToken) {
      return fail(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }

    if (secret_hash == "" || secret_hash !== resetPasswordToken.secret_hash) {
      return fail(MESSAGE_RESET_PASSWORD_ERROR.SECRET_HASH_INVALID);
    }

    hashedPassword = Hash.make(password);

    const filter = { id: resetPasswordToken.user_id };
    const update = { password: hashedPassword };
    const result = await userService.update(filter, update);

    if (!result) {
      return { success: false };
    }

    await this.deleteResetPasswordByUserId(
      resetPasswordToken.user_id.valueOf()
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return fail(error.message);
  }
};

// *******************************************************

exports.getResetPasswordByUserId = async (user_id) => {
  try {
    const resetPasswordToken = await ResetPasswordToken.findOne({
      user_id,
    });
    if (!resetPasswordToken) {
      return fail(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return success(resetPasswordToken);
  } catch (error) {
    console.error(error);
    return fail(error.message);
  }
};

// *******************************************************

exports.updateResetPasswordByUserId = async (data) => {
  try {
    const { user_id, secret_hash, otp_code, expire_at, verified_before } = data;
    // console.log({ user_id, secret_hash, otp_code, expire_at });
    const filter = { user_id };
    const update = { otp_code, secret_hash, expire_at, verified_before };
    const resetPasswordToken = await ResetPasswordToken.findOneAndUpdate(
      filter,
      update,
      {
        new: true,
        upsert: true,
      }
    );
    return success(resetPasswordToken);
  } catch (error) {
    console.error(error);
    return fail(error.message);
  }
};

// *******************************************************
exports.deleteResetPasswordByUserId = async (user_id) => {
  try {
    const resetPasswordToken = await ResetPasswordToken.deleteMany({
      user_id: user_id,
    });

    // console.log("resetPasswordToken : ", resetPasswordToken);
    return resetPasswordToken;
  } catch (error) {
    throw Error(error.message);
  }
};

// *******************************************************
// exports.deleteResetPasswordByUserId = async (user_id) => {
//   try {
//     console.log(".valueOf() : ", user_id.valueOf());
//     console.log(user_id);
//     const filter = { user_id };
//     const refreshToken = await ResetPasswordToken.findByIdAndDelete(filter);
//     return refreshToken;
//   } catch (error) {
//     throw Error(error.message);
//   }
// };

// *******************************************************

const getByOTP = async (otp_code) => {
  try {
    if (!otp_code) {
      return fail("otp_code invalid");
    }

    const result = await ResetPasswordToken.findOne({ otp_code });

    console.log("result : ", result);
    if (!result) {
      return fail(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return success(result);
  } catch (error) {
    console.error(error);
    return fail(error.message);
  }
};

// *******************************************************
