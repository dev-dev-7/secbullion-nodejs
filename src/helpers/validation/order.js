const { check } = require("express-validator");

// VALIDATION
exports.submit = [
  check("user_id").notEmpty(),
  check("product_id").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
  check("price").notEmpty(),
  check("currency").notEmpty(),
  check("delivery_id").notEmpty(),
  check("txn_token").notEmpty(),
];
