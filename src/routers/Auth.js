const express = require("express");
const router = express.Router();
const verifyToken = require("./../helpers/verifyToken");
const loginAction = require("./../controllers/Auth");

// Auth
router.post("/login", loginAction.login_validation, loginAction.Login);
router.post("/register", loginAction.register_validation, loginAction.Register);
router.post("/verify-otp", loginAction.VerifiyOtp);
router.post(
  "/change-password",
  [verifyToken, loginAction.change_password_validation],
  loginAction.ChangePassword
);
router.post(
  "/resend-otp",
  loginAction.resend_otp_validation,
  loginAction.ResendOtp
);

module.exports = router;
