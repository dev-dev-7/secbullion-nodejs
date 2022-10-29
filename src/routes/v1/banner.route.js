import express from "express";
import bannerController from "../../components/banner/banner.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router.route("/").get(bannerController.getAll).post(bannerController.create);

router
  .route("/:id")
  .get(bannerController.getById)
  .put(bannerController.update)
  .delete(bannerController._delete);

export default router;
