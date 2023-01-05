const { check } = require("express-validator");

// AUTH VALIDATION
exports.getAll = [check("user_id").notEmpty()];
