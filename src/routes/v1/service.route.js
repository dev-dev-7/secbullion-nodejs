import express from "express";
import serviceController from "../../components/service/service.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router.route("/").get(serviceController.getAll).post(serviceController.create);

router
  .route("/:id")
  .get(serviceController.getById)
  .put(serviceController.update)
  .delete(serviceController._delete);

export default router;
