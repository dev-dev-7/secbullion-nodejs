require("dotenv").config();
const productModel = require("../product/productModel");
const orderModel = require("../order/orderModel");
const {
  getSymbolPrice,
  sendBuyRequest,
  getRequestDetails,
  getPriceFromSymbol,
  getBalance,
  updateBalance,
  closeRequest,
} = require("../../helpers/mt5");
const {
  getExpiryDate,
  getDateTime,
  getNumberOfDays,
} = require("../../helpers/time");
const { updateWalletAmount } = require("../../helpers/updateWallet");

exports.priceUpdate = async (req, res) => {
  const products = await productModel.get();
  if (products) {
    for (var n = 1; n <= 15; n++) {
      let symbolPrices = await getSymbolPrice(products);
      console.log(symbolPrices);
      console.log(n);
      for (var i = 0; i < products.length; i++) {
        let price = await getPriceFromSymbol(symbolPrices, products[i].symbol);
        if (price) {
          await productModel.updateProductPrice(
            products[i].id,
            products[i].symbol,
            price
          );
        }
      }
    }
  }
  return res.status(200).json({ data: products });
};

exports.stakeUpdate = async (req, res) => {
  // let result = await sendBuyRequest(1000526, "GOLD.1g", 5);
  // let result = await getRequestDetails("GOLD.1g", 25280);
  // console.log("result:", result);
  const stakes = await orderModel.getAllStakes();
  if (stakes) {
    for (var i = 0; i < stakes.length; i++) {
      if (stakes[i].duration > 0) {
        let todayDate = getDateTime();
        let expiryDate = await getExpiryDate(
          stakes[i].created_at,
          parseInt(stakes[i].duration),
          stakes[i].duration_type
        );
        if (getNumberOfDays(expiryDate, todayDate) > 0) {
          if (stakes[i].mt5_position_id) {
            let symbolDetails = await getRequestDetails(
              stakes[i].mt5_position_id
            );
            if (symbolDetails) {
              await orderModel.updateStakeSwapValue(
                stakes[i].id,
                symbolDetails.SwapLong
              );
            }
          }
        } else {
          await orderModel.updateOrderProductStatus(stakes[i].id, "store");
        }
      }
    }
  }
  return res.status(200).json({ data: result });
};
