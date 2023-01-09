const { check } = require("express-validator");

// VALIDATION
exports.submit = [
  check("user_id").notEmpty(),
  check("price").notEmpty(),
  check("currency").notEmpty(),
  check("txn_token").notEmpty(),
  check("items").notEmpty(),
];
