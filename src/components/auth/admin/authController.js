const authModel = require("../authModel");
const profileModel = require("../../profile/profileModel");
const Hash = require("../../../helpers/hash.js");
const jwt = require("jsonwebtoken");
const smsglobal = require("../../../helpers/smsglobal");
const config = require("../../../config/index");
const { validationResult } = require("express-validator");
const { JWT_SECRETE_KEY } = config.tokens;

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userMetaData = await profileModel.getMetaDataKeyValue(
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
      return res.status(200).json({ data: user, token });
    } else {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await authModel.getUsers();
  if (users) {
    for (i = 0; i < users.length; i++) {
      users[i].id = i + 1;
      users[i].metadata = await profileModel.getUserMetaData(users[i].user_id);
    }
    return res.status(200).json({ data: users });
  } else {
    return res.status(401).json({ errors: [{ msg: "No users found" }] });
  }
};

exports.getUser = async (req, res) => {
  const users = await authModel.getUserById(req.params.user_id);
  if (users) {
    users.metadata = await profileModel.getUserMetaData(users.user_id);
    return res.status(200).json({ data: users });
  } else {
    return res.status(401).json({ errors: [{ msg: "No users found" }] });
  }
};

exports.status = async (req, res) => {
  const user = await authModel.getUserById(req.params.user_id);
  if (user) {
    await authModel.updateUser(user.user_id, { status: req.body.status });
    return res.status(200).json({
      data: await authModel.getUserById(user.user_id),
      msg: "Status has been updated!",
    });
  } else {
    return res.status(401).json({ errors: [{ msg: "No user found" }] });
  }
};
