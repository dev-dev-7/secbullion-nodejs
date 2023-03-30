require("dotenv").config();
const productModel = require("../product/productModel");
//const orderModel = require("../order/orderModel");
const { getSymbolPrice, getPriceFromSymbol } = require("../../helpers/mt5");

exports.priceUpdate = async (req, res) => {
  const products = await productModel.get();
  if (products) {
    for (var n = 1; n <= 35; n++) {
      console.log("n:" + n);
      let symbolPrices = await getSymbolPrice(products);
      for (var i = 0; i < products.length; i++) {
        let price = await getPriceFromSymbol(symbolPrices, products[i].symbol);
        if (price) {
          await productModel.updateProductPrice(
            products[i].id,
            products[i].symbol,
            price
          );
          //await orderModel.updateOrderProductPrice(products[i].id, price);
        }
      }
    }
  }
  return res.status(200).json({ data: products });
};
