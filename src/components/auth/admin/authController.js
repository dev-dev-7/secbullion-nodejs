const authModel = require("../authModel");
const Hash = require("../../../helpers/hash");
const jwt = require("jsonwebtoken");
const smsglobal = require("../../../helpers/smsglobal");
const config = require("../../../config/index");
const { validationResult } = require("express-validator");
const { JWT_SECRETE_KEY } = config.development;

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
      return res.status(200).json({ data: user, token });
    } else {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
  }
};
