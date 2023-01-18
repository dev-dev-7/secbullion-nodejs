const express = require("express");
const router = express.Router();
const orderController = require("../components/order/orderController");
const validation = require("../helpers/validation/order");
const verifyToken = require("./../helpers/verifyToken");

// order
router
  .route("/order-summary")
  .post([verifyToken, validation.summary], orderController.orderSummary);
router
  .route("/submit-order")
  .post([verifyToken, validation.submit], orderController.submit);
router
  .route("/my-stake/:user_id")
  .get([verifyToken], orderController.getMyStake);
router
  .route("/my-store/:user_id")
  .get([verifyToken], orderController.getMyStore);
router
  .route("/my-order/:user_id")
  .get([verifyToken], orderController.getMyOrder);
router
  .route("/order/change-status/:user_id")
  .put([verifyToken], orderController.changeMyOrderStatus);

module.exports = router;
