const { check } = require("express-validator");

// AUTH VALIDATION
exports.add = [check("meta_key").notEmpty(), check("meta_values").notEmpty()];
exports.update = [
  check("meta_key").notEmpty(),
  check("meta_values").notEmpty(),
  check("status").notEmpty(),
];
