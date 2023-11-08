require("dotenv").config();
const { validationResult } = require("express-validator");
const productModel = require("./productModel");
const { authorization } = require("../../helpers/authorization");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authorization(req, res);
  // All Products
  const products = await productModel.getActiveProductsWithFiles();
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      products[p].value = {
        currency: user?.currency ? user.currency : process.env.DEFAULT_CURRENCY,
        symbol: products[p].symbol,
        unit: products[p].unit,
        price: products[p].last_price,
        current_rate: products[p].price,
      };
    }
  }
  return res.status(200).json({ data: products });
};

exports.details = async (req, res) => {
  let user = await authorization(req, res);
  const product = await productModel.getById(req.params.product_id);
  if (product) {
    product.files = await productModel.getByFilesByProduct(product.id);
    product.value = {
      currency: user?.currency ? user.currency : process.env.DEFAULT_CURRENCY,
      symbol: product.symbol,
      unit: product.unit,
      price: product.last_price,
      current_rate: product.price,
    };
  }
  return res.status(200).json({ data: product });
};

exports.getFiles = async (req, res) => {
  let files = await productModel.getFilesByProductId(req.params.product_id);
  return res.status(200).json({ data: files });
};
