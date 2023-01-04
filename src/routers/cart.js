const express = require("express");
const router = express.Router();
const cartController = require("../components/cart/cartController");
const validation = require("../helpers/validation/cart");
const verifyToken = require("./../helpers/verifyToken");

// Category
router
  .route("/cart")
  .post([verifyToken, validation.create], cartController.create);
router
  .route("/cart/:user_id")
  .get([verifyToken], cartController.get)
  .put([verifyToken, validation.update], cartController.update)
  .delete([verifyToken, validation.delete], cartController.delete);

module.exports = router;
