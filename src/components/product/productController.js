require("dotenv").config();
const { validationResult } = require("express-validator");
const productModel = require("./productModel");
const { getSymbolPrice, getPriceFromSymbol } = require("../../helpers/mt5");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  // All Products
  const products = await productModel.getActiveProductsWithFiles();
  let symbolPrices = await getSymbolPrice(products);
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      products[p].value = {
        currency: process.env.DEFAULT_CURRENCY,
        symbol: products[p].symbol,
        unit: products[p].unit,
        price: await getPriceFromSymbol(
          symbolPrices,
          products[p].symbol,
          products[p].last_price
        ),
        current_rate: products[p].price,
      };
    }
  }
  return res.status(200).json({ data: products });
};

exports.details = async (req, res) => {
  const product = await productModel.getById(req.params.product_id);
  let symbolPrices = await getSymbolPrice([{ symbol: product.symbol }]);
  if (product) {
    product.files = await productModel.getByFilesByProduct(product.id);
    product.value = {
      currency: process.env.DEFAULT_CURRENCY,
      symbol: product.symbol,
      unit: product.unit,
      price: await getPriceFromSymbol(
        symbolPrices,
        product.symbol,
        product.last_price
      ),
      current_rate: product.price,
    };
  }
  return res.status(200).json({ data: product });
};

exports.getFiles = async (req, res) => {
  let files = await productModel.getFilesByProductId(req.params.product_id);
  return res.status(200).json({ data: files });
};
