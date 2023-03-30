require("dotenv").config();
const { validationResult } = require("express-validator");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  // My Stake
  const stakes = await orderModel.getByStatus(req.params.user_id, ["stake"]);
  if (stakes) {
    for (var t = 0; t < stakes.length; t++) {
      stakes[t].product = await productModel.getProductWithFile(
        stakes[t].product_id
      );
      if (stakes[t].product) {
        stakes[t].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          symbol: stakes[t].product.symbol,
          unit: stakes[t].product.unit,
          quantity: stakes[t].quantity,
          price: (stakes[t].product.last_price * stakes[t].quantity).toFixed(2),
          current_rate: stakes[t].product.price,
        };
      }
    }
  }
  // My Store
  const stores = await orderModel.getByStatus(req.params.user_id, ["store"]);
  if (stores) {
    for (var s = 0; s < stores.length; s++) {
      stores[s].product = await productModel.getProductWithFile(
        stores[s].product_id
      );
      if (stores[s].product) {
        stores[s].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          symbol: stores[s].product.symbol,
          unit: stores[s].product.unit,
          quantity: stores[s].quantity,
          price: (stores[s].product.last_price * stores[s].quantity).toFixed(2),
          current_rate: stores[s].product.price,
        };
      }
    }
  }
  // My Order
  const orders = await orderModel.getByStatus(req.params.user_id, [
    "collect",
    "deliver",
  ]);
  if (orders) {
    for (var o = 0; o < orders.length; o++) {
      orders[o].product = await productModel.getProductWithFile(
        orders[o].product_id
      );
      if (orders[o].product) {
        orders[o].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          symbol: orders[o].product.symbol,
          unit: orders[o].product.unit,
          quantity: orders[o].quantity,
          price: (orders[o].product.last_price * orders[o].quantity).toFixed(2),
          current_rate: orders[o].product.price,
        };
      }
    }
  }
  let result = {
    user_id: req.params.user_id,
    my_stake: stakes,
    my_store: stores,
    my_order: orders,
  };
  return res.status(200).json({ data: result });
};
