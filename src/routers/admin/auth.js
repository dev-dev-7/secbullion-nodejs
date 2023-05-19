const express = require('express')
const router = express.Router()
const authController = require('../../components/auth/authController')
const adminAuthController = require('../../components/auth/admin/authController')
const profileController = require('../../components/profile/profileController')
const validation = require('../../helpers/validation/auth')
const verifyToken = require("../../helpers/verifyToken");

// Auth
router.post('/login', validation.login_validation, adminAuthController.login)

// Users
router.post('/users', adminAuthController.getAllUsers)
router.put('/users/:user_id',[verifyToken], adminAuthController.status)
router.get('/user/:user_id', adminAuthController.getUser)
router.get('/user/address/:user_id', profileController.getAllAddress)
router.post('/user/address', profileController.getAddress)
router.post(
  '/resend-otp',
  validation.resend_otp_validation,
  authController.resendOtp,
)
router.post(
  '/reset-password',
  validation.reset_password_validation,
  authController.resetPassword,
)

module.exports = router
