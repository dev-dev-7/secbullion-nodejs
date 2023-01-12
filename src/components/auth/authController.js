const authModel = require("./authModel");
const walletModel = require("../wallet/walletModel");
const Hash = require("../../helpers/hash");
const jwt = require("jsonwebtoken");
const smsglobal = require("../../helpers/smsglobal");
const time = require("../../helpers/time");
const config = require("../../config/index");
const { validationResult } = require("express-validator");
const { JWT_SECRETE_KEY } = config.tokens;

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userMetaData = await authModel.getMetaDataKeyValue(
    "email",
    req.body.email
  );
  if (userMetaData === undefined) {
    return res.status(404).json({ errors: [{ msg: "Invalid credentials" }] });
  } else {
    let user = await authModel.getUserById(userMetaData.user_id);
    if (Hash.check(req.body.password, user.password)) {
      const token = jwt.sign({ user: user }, JWT_SECRETE_KEY);
      if (user.otp_verified == 0) {
        smsglobal.sendMessage(user.mobile);
      }
      return res.status(200).json({
        data: {
          user: user,
          metadata: await authModel.getUserMetaData(user.user_id),
        },
        token,
      });
    } else {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
  }
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const user = await authModel.createUser(req.body);
  if (user) {
    var arr = Object.entries(req.body);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] != "password") {
        let exist = await authModel.getUserMetaDataKeyValue(
          user.user_id,
          arr[i][0],
          arr[i][1]
        );
        if (exist) {
          await authModel.updateUserMetaData(
            user.user_id,
            arr[i][0],
            arr[i][1]
          );
        } else {
          await authModel.insertUserMetaData(
            user.user_id,
            arr[i][0],
            arr[i][1]
          );
        }
      }
    }
    // Addtional fields
    let otp_code = Math.floor(100000 + Math.random() * 900000);
    if (user.user_id) {
      await authModel.insertUserMetaData(user.user_id, "otp_code", otp_code);
      await authModel.insertUserMetaData(user.user_id, "user_id", user.user_id);
      await walletModel.insertWallet(user.user_id, 0, 0, 0);
      smsglobal.sendMessage(req.body.mobile, otp_code);
    }
    return res.status(201).json({
      data: {
        user: user,
        metadata: await authModel.getUserMetaData(user.user_id),
      },
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.verifiyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let mobile = await authModel.getUserMetaDataKeyValue(
    req.body.user_id,
    "mobile",
    req.body.mobile
  );
  if (mobile) {
    let otp_code = await authModel.getUserMetaDataKeyValue(
      req.body.user_id,
      "otp_code",
      req.body.otp_code
    );
    if (otp_code) {
      let user = await authModel.updateUser(req.body.user_id, { status: 1 });
      await authModel.updateUserMetaData(
        req.body.user_id,
        "otp_code",
        Math.floor(100000 + Math.random() * 900000)
      );
      const token = jwt.sign({ user: user }, JWT_SECRETE_KEY);
      return res.status(201).json({
        data: {
          user: user,
          metadata: await authModel.getUserMetaData(user.user_id),
        },
        token,
      });
    } else {
      return res.status(400).json({ errors: [{ msg: "Invalid Code" }] });
    }
  } else {
    return res.status(404).json({ errors: [{ msg: "Not Found" }] });
  }
};

exports.resendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let otp_code = Math.floor(100000 + Math.random() * 900000);
  let mobile = await authModel.getMetaDataKeyValue("mobile", req.body.mobile);
  if (mobile) {
    let otp = await authModel.getUserMetaDataKey(mobile.user_id, "otp_code");
    let otpHistory = await authModel.getUserHistoryKey(
      mobile.user_id,
      "otp_code",
      time.timeNow(600, "minus")
    );
    if (otp && otpHistory?.length < 5) {
      await authModel.updateUserMetaData(mobile.user_id, "otp_code", otp_code);
      smsglobal.sendMessage(req.body.mobile, otp_code);
      await authModel.insertUserHistory(mobile.user_id, "otp_code", otp_code);
      return res.status(200).json({
        data: await authModel.getUserMetaData(mobile.user_id),
        msg: "Otp Sent",
      });
    } else {
      await authModel.insertUserMetaData(mobile.user_id, "otp_code", otp_code);
      return res.status(403).json({ errors: [{ msg: "Too many request" }] });
    }
  } else {
    return res.status(404).json({ errors: [{ msg: "Not Found" }] });
  }
};

exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authModel.updateUser(req.body.user_id, {
    password: Hash.make(req.body.password),
  });
  if (user) {
    await authModel.updateUserMetaData(
      req.body.user_id,
      "otp_code",
      Math.floor(100000 + Math.random() * 900000)
    );
    return res.status(201).json({
      data: await authModel.getUserMetaData(user.user_id),
      msg: "Password Updated",
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ msg: "logout success" });
};

exports.deleteAccount = async (req, res) => {
  console.log("user_id:", req.body.user_id);
  return res.status(200).json({ msg: "account deleted" });
};
