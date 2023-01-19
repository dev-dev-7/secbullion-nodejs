const { check } = require("express-validator");

// VALIDATION

exports.summary = [check("user_id").notEmpty()];

exports.submit = [
  check("user_id").notEmpty(),
  check("subtotal").notEmpty(),
  check("total").notEmpty(),
  check("currency").notEmpty(),
  check("txn_token").notEmpty(),
  check("items").notEmpty(),
];
