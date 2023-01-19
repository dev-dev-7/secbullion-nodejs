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
  .route("/cart/:product_id/:user_id/:type")
  .get([verifyToken], cartController.get)
  .put([verifyToken, validation.update], cartController.update)
  .delete([verifyToken], cartController.delete);

module.exports = router;
