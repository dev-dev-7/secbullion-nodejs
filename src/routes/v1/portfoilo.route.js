import express from "express";
import portfolioController from "../../components/portfoilo/portfolio.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router
  .route("/")
  .get(portfolioController.getAll)
  .post(portfolioController.create);

router
  .route("/:id")
  .get(portfolioController.getById)
  .put(portfolioController.update)
  .delete(portfolioController._delete);

export default router;
