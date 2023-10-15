const { check } = require("express-validator");

exports.payment = [check("card_id").notEmpty(), check("amount").notEmpty()];

exports.withdraw = [
  check("user_id").notEmpty(),
  check("amount").notEmpty(),
  check("currency").notEmpty(),
];

exports.withdrawAccept = [check("id").notEmpty()];
