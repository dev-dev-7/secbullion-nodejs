const { check } = require("express-validator");

// AUTH VALIDATION
exports.create = [
  check("user_id").notEmpty(),
  check("account_holder_name").notEmpty(),
  check("iban").notEmpty(),
  check("bank_name").notEmpty(),
  check("branch").notEmpty(),
  check("swift_code").notEmpty(),
];
exports.update = [
  check("id").notEmpty(),
  check("account_holder_name").notEmpty(),
  check("iban").notEmpty(),
  check("bank_name").notEmpty(),
  check("branch").notEmpty(),
  check("swift_code").notEmpty(),
];
