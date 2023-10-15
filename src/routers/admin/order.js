const express = require("express");
const router = express.Router();
const adminOrderController = require("../../components/order/admin/orderController");
const verifyToken = require("../../helpers/verifyToken");

// Product
router.route("/orders").post([verifyToken], adminOrderController.get);
router
  .route("/order/change-status/:user_id")
  .put([verifyToken], adminOrderController.changeMyOrderItemStatus);
router
  .route("/order/change-order-status/:order_id")
  .put([verifyToken], adminOrderController.changeMyOrderStatus);
router
  .route("/order/activity/:order_product_id")
  .get([verifyToken], adminOrderController.activity);

module.exports = router;
