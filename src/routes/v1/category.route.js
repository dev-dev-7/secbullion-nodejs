import express from "express";
import categoryController from "../../components/category/category.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router
  .route("/")
  .get(categoryController.getAll)
  .post(categoryController.create);

router
  .route("/:id")
  .get(categoryController.getById)
  .put(categoryController.update)
  .delete(categoryController._delete);

export default router;
