const { check } = require("express-validator");

exports.card = [check("token").notEmpty()];
