const express = require("express");
const router = express.Router();
const productController = require("../../components/product/admin/productController");
const validation = require("../../helpers/validation/product");
const verifyToken = require("../../helpers/verifyToken");

// Product
router
  .route("/product")
  .post([verifyToken, validation.add], productController.add);
router.route("/product/get").post(productController.getAll);
router
  .route("/product/:id")
  .put([verifyToken, validation.update], productController.update)
  .delete([verifyToken], productController.delete);

module.exports = router;
