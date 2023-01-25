require("dotenv").config();
const {
  getAllSymbolsPrice,
} = require("../../helpers/mt5Commands/getProductPrice");
const productModel = require("../product/productModel");

exports.priceUpdate = async (req, res) => {
  let mt5PriceArray = {};
  const products = await productModel.getActiveProducts();
  if (products) {
    mt5PriceArray = await getAllSymbolsPrice(products);
  }
  return res.status(200).json({ data: mt5PriceArray });
};
