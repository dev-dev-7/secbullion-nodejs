import express from "express";
import detailController from "../../components/details/detail.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router.route("/").get(detailController.getAll).post(detailController.create);

router
  .route("/:id")
  .get(detailController.getById)
  .put(detailController.update)
  .delete(detailController._delete);

export default router;
