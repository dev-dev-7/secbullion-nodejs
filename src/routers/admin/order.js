const express = require("express");
const router = express.Router();
const orderController = require("../../components/order/admin/orderController");
const verifyToken = require("../../helpers/verifyToken");

// Product
router
  .route("/orders/:page")
  .get([verifyToken], orderController.get);

module.exports = router;
