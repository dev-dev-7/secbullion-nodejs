import authController from "../../components/auth/auth.controller.js";
import express from "express";
var router = express.Router();

// *****************************************************

router
  .post("/login", authController.login)
  .post("/register", authController.register);

export default router;
