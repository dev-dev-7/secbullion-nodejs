const express = require("express");
const router = express.Router();
const orderController = require("../../components/order/orderController");
const adminOrderController = require("../../components/order/admin/orderController");
const verifyToken = require("../../helpers/verifyToken");

// Product
router.route("/orders/:page").post([verifyToken], adminOrderController.get);
router
  .route("/order/change-status/:user_id")
  .put([verifyToken], orderController.changeMyOrderStatus);

module.exports = router;
