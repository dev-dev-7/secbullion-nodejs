const { check, body } = require("express-validator");
const authModel = require("../../components/auth/authModel");

// AUTH VALIDATION
exports.login_validation = [
  check("email").isEmail(),
  check("password")
    .notEmpty()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

exports.register_validation = [
  check("first_name").notEmpty(),
  check("last_name").notEmpty(),
  check("email")
    .isEmail()
    .custom(async (value) => {
      if (await authModel.getMetaDataKeyValue("email", value))
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

exports.otp_validation = [
  check("user_id").notEmpty(),
  check("mobile").notEmpty(),
  check("otp_code")
    .notEmpty()
    .bail()
    .isLength({ min: 6 })
    .withMessage("Otp must be at least 6 digit long"),
];

exports.resend_otp_validation = [check("mobile").notEmpty()];

exports.reset_password_validation = [
  check("user_id").notEmpty(),
  check("otp_code")
    .notEmpty()
    .bail()
    .isLength({ min: 6 })
    .withMessage("Otp must be at least 6 digit long"),
  check("password")
    .notEmpty()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

exports.delete_account_validation = [check("user_id").notEmpty()];
