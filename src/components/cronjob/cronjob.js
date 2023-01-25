require("dotenv").config();
const {
  getAllSymbolsPrice,
  getPriceFromSymbol,
} = require("../../helpers/mt5Commands/getProductPrice");
const productModel = require("../product/productModel");

exports.priceUpdate = async (req, res) => {
  let mt5PriceArray = {};
  const products = await productModel.getActiveProducts();
  if (products) {
    mt5PriceArray = await getAllSymbolsPrice(products);
    for (var i = 0; i < products.length; i++) {
      let price = await getPriceFromSymbol(mt5PriceArray, products[i].symbol);
      await productModel.updateProductPrice(
        products[i].id,
        products[i].symbol,
        price
      );
    }
  }
  return res.status(200).json({ data: mt5PriceArray });
};
