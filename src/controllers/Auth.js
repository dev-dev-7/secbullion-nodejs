const User = require("./../models/AuthModel");
const Hash = require("./../helpers/Hash");
const { check, validationResult, body } = require("express-validator");
const jwt = require("jsonwebtoken");
const Twilio = require("./../helpers/Twilio");
const config = require("../config/index");
/**
 * Auth login
 * @param {any} data message
 */

const { JWT_SECRETE_KEY } = config.development;

exports.login_validation = [
  check("email").isEmail(),
  check("password")
    .notEmpty()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

exports.Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const user = await User.getUserByEmail(req.body.email);
  if (user === undefined) {
    return res.status(404).json({ errors: [{ msg: "Invalid credentials" }] });
  } else {
    if (Hash.check(req.body.password, user?.password)) {
      const token = jwt.sign({ user: user }, JWT_SECRETE_KEY);
      if (user.otp_verified == 0) {
        Twilio.Send(user.mobile);
      }
      return res.status(200).json({ data: user, token });
    } else {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }
  }
};

exports.register_validation = [
  check("email")
    .isEmail()
    .custom(async (value) => {
      if (await User.getUserByEmail(value))
        return Promise.reject("E-mail already exists");
    }),
  check("mobile").notEmpty(),
  check("password")
    .notEmpty()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  // Sanitization
  body("mobile").customSanitizer((value, { req }) => {
    if (value) return value[0] == "0" ? value.substr(1) : value;
  }),
];

exports.Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const user = await User.registerUser(req.body);
  const token = jwt.sign({ user: user }, JWT_SECRETE_KEY);
  Twilio.Send(req.body.mobile);
  res.status(201).json({ data: user, token });
};

exports.VerifiyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await User.getUser({ mobile: req.body.mobile });
  user = await User.updateUserById(user.id, { otp_verified: "1" });
  const verified = await Twilio.Verify(req.body.mobile, req.body.code);
  if (verified) {
    const token = jwt.sign({ user: user }, JWT_SECRETE_KEY);
    res.send({ data: user, token });
  } else res.status(400).json({ errors: [{ msg: "Invalid code" }] });
};

exports.change_password_validation = [
  check("password")
    .notEmpty()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  check("code").notEmpty().withMessage("You must enter OTP code"),
];

exports.ChangePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = jwt.verify(req.token, JWT_SECRETE_KEY).user;
  const verified = await Twilio.Verify(user.mobile, req.body.code);
  if (verified) {
    update = await User.updateUserById(user.id, {
      password: Hash.make(req.body.password),
    });
    if (update) {
      res.send({ data: update });
    } else
      res
        .status(400)
        .json({ errors: [{ msg: "Error while updateing the password" }] });
  } else {
    res.status(400).json({ errors: [{ msg: "Invalid code" }] });
  }
};

exports.resend_otp_validation = [check("mobile").notEmpty()];

exports.ResendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let user = await User.getUser({ mobile: req.body.mobile });
  if (user === undefined) {
    return res.status(404).json({ errors: [{ msg: "Not found" }] });
  } else {
    Twilio.Send(user.mobile);
    return res.status(200).json({ data: user });
  }
};
