const express = require("express");
const router = express.Router();
const productController = require("../components/product/productController");

// Product
router.route("/product").get(productController.getAll);
router.route("/product/details/:product_id").get(productController.details);
router.route("/product/files/:product_id").get(productController.getFiles);

module.exports = router;
