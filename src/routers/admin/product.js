const express = require("express");
const router = express.Router();
const productController = require("../../components/product/admin/productsController");
const validation = require("../../helpers/validation/product");
const verifyToken = require("../../helpers/verifyToken");

// Product
router
  .route("/products")
  .get([verifyToken, validation.get], productController.get);
router
  .route("/product")
  .post([verifyToken, validation.add], productController.add);
router
  .route("/product/:id")
  .put([verifyToken, validation.update], productController.update)
  .delete([verifyToken], productController.delete);

module.exports = router;
