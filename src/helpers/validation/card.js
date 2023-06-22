const { check } = require("express-validator");

exports.card = [
  check("method").notEmpty(),
  check("type").notEmpty(),
  check("token").notEmpty(),
  check("last_digit").notEmpty(),
  check("expiry_date").notEmpty(),
];
