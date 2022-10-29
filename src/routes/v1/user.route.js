import userController from "../../components/user/user.controller.js";
import express from "express";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router.route("/").get(userController.getAll).post(userController.create);

router
  .route("/:id")
  .get(userController.getById)
  .put(userController.update)
  .delete(userController._delete);

export default router;
