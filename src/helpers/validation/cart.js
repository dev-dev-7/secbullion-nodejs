const { check } = require("express-validator");

// AUTH VALIDATION
exports.create = [
  check("user_id").notEmpty(),
  check("product_id").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
];
exports.update = [
  check("product_id").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
];
exports.delete = [check("product_id").notEmpty()];
