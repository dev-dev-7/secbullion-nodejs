require("dotenv").config();
const {getSymbol} = require("../../helpers/mt5");
const productModel = require("../product/productModel");
const orderModel = require("../order/orderModel");

exports.priceUpdate = async (req, res) => {
  let mt5PriceArray = {};
  const products = await productModel.get();
  // if (products) {
  //   mt5PriceArray = await getAllSymbolsPrice(products);
  //   for (var i = 0; i < products.length; i++) {
  //     let price = await getPriceFromSymbol(mt5PriceArray, products[i].symbol);
  //     if (price) {
  //       await productModel.updateProductPrice(
  //         products[i].id,
  //         products[i].symbol,
  //         price
  //       );
  //       await orderModel.updateOrderProductPrice(products[i].id, price);
  //     }
  //   }
  // }
  return res.status(200).json({ data: products });
};
