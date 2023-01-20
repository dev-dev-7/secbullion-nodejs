const { check } = require("express-validator");

// AUTH VALIDATION
exports.create = [
  check("user_id").notEmpty(),
  check("bank_detail_id").notEmpty(),
  check("amount").notEmpty(),
  check("reference_number").notEmpty(),
];
