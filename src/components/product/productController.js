require("dotenv").config();
const { validationResult } = require("express-validator");
const productModel = require("./productModel");
const categoryModel = require("../category/categoryModel");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  // All Products
  const products = await productModel.getActiveProducts();
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      
      products[p].value = {
        currency: process.env.DEFAULT_CURRENCY,
        unit: products[p].unit,
        price: products[p].last_price.toFixed(2),
        current_rate: products[p].price,
      };
    }
  }
  return res.status(200).json({ data: products });
};

exports.details = async (req, res) => {
  const product = await productModel.getById(req.params.product_id);
  if (product) {
    product.files = await productModel.getByFilesByProduct(product.id);
  }
  return res.status(200).json({ data: product });
};
