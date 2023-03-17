const express = require("express");
const router = express.Router();
const authController = require("../../components/auth/admin/authController");
const profileController = require("../../components/profile/profileController");
const validation = require("../../helpers/validation/auth");

// Auth
router.post("/login", validation.login_validation, authController.login);

// Users
router.post("/users", authController.getAllUsers);
router.put("/users/:user_id", authController.status);
router.get("/user/:user_id", authController.getUser);
router.get("/user/address/:user_id", profileController.getAllAddress);
router.post("/user/address", profileController.getAddress);

module.exports = router;
