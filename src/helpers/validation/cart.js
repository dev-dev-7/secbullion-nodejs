const { check } = require("express-validator");

// AUTH VALIDATION
exports.create = [
  check("user_id").notEmpty(),
  check("product_id").notEmpty(),
  check("items").notEmpty(),
];
exports.update = [
  check("type").notEmpty(),
  check("product_id").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
];
exports.delete = [check("type").notEmpty(), check("product_id").notEmpty()];
