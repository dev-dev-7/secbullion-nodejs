const express = require("express");
const router = express.Router();
const cartController = require("../components/cart/cartController");
const validation = require("../helpers/validation/cart");
const verifyToken = require("./../helpers/verifyToken");

// Category
router
  .route("/cart")
  .post([verifyToken, validation.create], cartController.create);
router.route("/cart/:user_id").post([verifyToken], cartController.get);
router
  .route("/cart/:user_id")
  .put([verifyToken, validation.update], cartController.update);
router
  .route("/cart/:user_id/:product_id/:type")
  .delete([verifyToken], cartController.delete);

module.exports = router;
