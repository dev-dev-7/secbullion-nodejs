const { check } = require("express-validator");

// AUTH VALIDATION
exports.add = [check("title").notEmpty()];
exports.update = [check("title").notEmpty(), check("status").notEmpty()];
