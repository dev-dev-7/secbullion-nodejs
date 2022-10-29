import express from "express";
import aboutUsController from "../../components/aboutUs/aboutUs.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router.route("/").get(aboutUsController.getAll).post(aboutUsController.create);

router
  .route("/:id")
  .get(aboutUsController.getById)
  .put(aboutUsController.update)
  .delete(aboutUsController._delete);

export default router;
