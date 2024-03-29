const { check, body } = require("express-validator");
const profileModel = require("../../components/profile/profileModel");

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
  check("full_name").notEmpty(),
  check("email")
    .isEmail()
    .custom(async (value) => {
      if (await profileModel.getMetaDataKeyValue("email", value))
        return Promise.reject("E-mail already used");
    }),
  check("mobile")
    .notEmpty()
    .custom(async (value) => {
      if (await profileModel.getMetaDataKeyValue("mobile", value))
        return Promise.reject("Mobile already used");
    }),
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
  check("password")
    .notEmpty()
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

exports.delete_account_validation = [check("user_id").notEmpty()];

exports.add_address = [check("address").notEmpty()];

exports.put_address = [
  check("address_id").notEmpty(),
  check("address").notEmpty(),
];

exports.delete_address = [check("address_id").notEmpty()];

exports.document_validation = [
  check("user_id").notEmpty(),
  check("passport").notEmpty(),
  check("emirates_id").notEmpty(),
  check("utility_bill").notEmpty(),
];
