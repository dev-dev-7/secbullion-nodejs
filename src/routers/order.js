const express = require("express");
const router = express.Router();
const orderController = require("../components/order/orderController");
const validation = require("../helpers/validation/order");
const verifyToken = require("./../helpers/verifyToken");

// Category
router
  .route("/submit-order")
  .post([verifyToken, validation.submit], orderController.submit);

module.exports = router;
