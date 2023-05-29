require("dotenv").config();
const productModel = require("../product/productModel");
const orderModel = require("../order/orderModel");
const {
  getSymbolPrice,
  buyPosition,
  sellPosition,
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
      for (var i = 0; i < products.length; i++) {
        let price = await getPriceFromSymbol(symbolPrices, products[i].symbol);
        if (price) {
          await productModel.updateProductPrice(
            products[i].id,
            products[i].symbol,
            price.Ask,
            price.Bid
          );
          await orderModel.updateOrderProductPrice(products[i].id, price.Ask);
        }
      }
    }
  }
  return res.status(200).json({ data: products });
};

exports.stakeUpdate = async (req, res) => {
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
                symbolDetails.Storage
              );
            }
          }
        } else {
          await orderModel.updateOrderProductStatus(stakes[i].id, "store");
        }
      }
    }
  }
  return res.status(200).json({ data: stakes });
};

exports.test = async (req, res) => {
  // let stakes = await buyPosition(1000532, "GOLD.1g", 10);
  // let stakes = await sellPosition(1000532, "GOLD.1g", 5, 25858);
  // let stakes = await getRequestDetails(1000526, 25379);
  // console.log("result:", stakes);
  // return res.status(200).json({ data: stakes });
};
