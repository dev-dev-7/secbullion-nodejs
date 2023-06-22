const { check } = require("express-validator");

exports.payment = [check("card_id").notEmpty(), check("amount").notEmpty()];
