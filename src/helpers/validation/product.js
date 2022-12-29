const { check } = require("express-validator");

// AUTH VALIDATION
exports.add = [
  check("category_id").notEmpty(),
  check("title").notEmpty(),
  check("description").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
];
exports.get = [check("category_id").notEmpty()];
exports.update = [
  check("category_id").notEmpty(),
  check("title").notEmpty(),
  check("description").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
  check("status").notEmpty(),
];
