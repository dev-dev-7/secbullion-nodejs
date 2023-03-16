const { check } = require("express-validator");

// AUTH VALIDATION
exports.add = [
  check("category_id").notEmpty(),
  check("title").notEmpty(),
  check("description").notEmpty(),
  check("about").notEmpty(),
  check("specification").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
  check("symbol").notEmpty(),
  check("files").notEmpty(),
];
exports.get = [check("category_id").notEmpty()];
exports.details = [check("product_id").notEmpty()];
exports.update = [
  check("category_id").notEmpty(),
  check("title").notEmpty(),
  check("description").notEmpty(),
  check("about").notEmpty(),
  check("specification").notEmpty(),
  check("quantity").notEmpty(),
  check("unit").notEmpty(),
  check("status").notEmpty(),
  check("files").notEmpty(),
];
