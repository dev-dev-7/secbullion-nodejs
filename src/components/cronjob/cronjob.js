require("dotenv").config();
const productModel = require("../product/productModel");
const orderModel = require("../order/orderModel");
const profileModel = require("../profile/profileModel");
const {
  getSymbolPrice,
  buyPosition,
  sellPosition,
  getRequestDetails,
  getSymbolDetails,
  getPriceFromSymbol,
  getSingleSymbolPrice,
  getBalance,
  updateBalance,
  updatePosition,
  closePosition,
} = require("../../helpers/mt5");
const {
  getExpiryDate,
  getDateTime,
  getNumberOfDays,
} = require("../../helpers/time");
const { updateWalletAmount } = require("../../helpers/updateWallet");

exports.priceUpdate = async (req, res) => {
  const products = await productModel.getAll();
  if (products) {
    for (var n = 1; n <= 20; n++) {
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
          await orderModel.updateOrderProductPrice(products[i].id, price.Bid);
        }
      }
    }
  }
  return res.status(200).json({ data: products });
};

exports.stakeUpdate = async (req, res) => {
  const stakes = await orderModel.getAllStakes();
  if (stakes.length) {
    let symbolPrices = await getSymbolPrice(stakes);
    for (var i = 0; i < stakes.length; i++) {
      if (stakes[i].duration > 0) {
        if (stakes[i].mt5_position_id) {
          let todayDate = getDateTime();
          let expiryDate = await getExpiryDate(
            stakes[i].created_at,
            parseInt(stakes[i].duration),
            stakes[i].duration_type
          );
          if (getNumberOfDays(expiryDate, todayDate) > 0) {
            if (stakes[i].mt5_position_id) {
              let price = await getPriceFromSymbol(
                symbolPrices,
                stakes[i].symbol
              );
              if (price) {
                let average = (
                  parseFloat(stakes[i].swap) + parseFloat(price.Ask - price.Bid)
                ).toFixed(2);
                await orderModel.updateStakeSwapValue(stakes[i].id, average, 0);
              }
            }
          } else {
            await orderModel.updateOrderProductStatus(stakes[i].id, "store");
          }
        }
      }
    }
  }
  return res.status(200).json({ data: stakes });
};

exports.test = async (req, res) => {
  // let test = await updateWalletAmount(28, 100, "+", "xxx");
  // let test = await closePosition(1000552, "PAMPSuisse-5gm", 1, 27130);
  let test = await getSymbolDetails("PAMPSuisse-5gm");
  // console.log("result:", stakes);
  return res.status(200).json({ data: test });
};
