import express from "express";
import settingsController from "../../components/settings/settings.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router
  .route("/")
  //   .get(settingsController.getAll)
  .post(settingsController.create);

router
  .route("/:id")
  .get(settingsController.getById)
  .put(settingsController.update)
  .delete(settingsController._delete);

export default router;
