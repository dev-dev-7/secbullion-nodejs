const express = require("express");
const router = express.Router();
const bankDetailsController = require("../components/bankDetails/bankDetailsController");
const validation = require("../helpers/validation/bankDetails");
const verifyToken = require("./../helpers/verifyToken");

// Category
router
  .route("/bank")
  .post([verifyToken, validation.create], bankDetailsController.create);
router
  .route("/bank/:user_id")
  .get([verifyToken], bankDetailsController.get)
  .put([verifyToken, validation.update], bankDetailsController.update);
router
  .route("/bank/:user_id/:id")
  .delete([verifyToken], bankDetailsController.delete);

module.exports = router;
