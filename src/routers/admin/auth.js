const express = require("express");
const router = express.Router();
const authController = require("../../components/auth/admin/authController");
const validation = require("../../helpers/validation");

// Auth
router.post("/login", validation.login_validation, authController.login);

module.exports = router;
