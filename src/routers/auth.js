const express = require("express");
const router = express.Router();
const verifyToken = require("./../helpers/verifyToken");
const authController = require("../components/auth/authController");
const validation = require("../helpers/validation/auth");

// Auth
router.post("/login", validation.login_validation, authController.login);

router.post(
  "/register",
  validation.register_validation,
  authController.register
);
router.post(
  "/verify-otp",
  validation.otp_validation,
  authController.verifiyOtp
);
router.post(
  "/resend-otp",
  validation.resend_otp_validation,
  authController.resendOtp
);

router.post(
  "/reset-password",
  [verifyToken, validation.reset_password_validation],
  authController.resetPassword
);

router.post("/logout", [verifyToken], authController.logout);

router.post(
  "/delete-account",
  [verifyToken, validation.delete_account_validation],
  authController.deleteAccount
);

router.get(
  "/validate",
  authController.validateToken
);

router.get("/user/:user_id", authController.getUser);

router.post(
  "/upload-documents",
  [validation.document_validation],
  authController.uploadDocuments
);

module.exports = router;
