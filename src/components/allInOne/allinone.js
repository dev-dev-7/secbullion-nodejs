require("dotenv").config();
const { validationResult } = require("express-validator");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");
const { getSymbol } = require("../../helpers/mt5");

exports.getAll = async (req, res) => {
  // let ress = await getSymbol("XAUUSD");
  //  return res.status(200).json({ data: ress});
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  // My Stake
  const stake = await orderModel.getByStatus(req.body.user_id, ["stake"]);
  if (stake) {
    for (var t = 0; t < stake.length; t++) {
      stake[t].product = await productModel.getProductWithFile(
        stake[t].product_id
      );
      if (stake[t].product) {
        stake[t].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          symbol: stake[t].product.symbol,
          unit: stake[t].product.unit,
          quantity: stake[t].quantity,
          price: (stake[t].price * stake[t].quantity).toFixed(2),
          current_rate: stake[t].product.price,
        };
      }
    }
  }
  // My Store
  const store = await orderModel.getByStatus(req.body.user_id, ["store"]);
  if (store) {
    for (var s = 0; s < store.length; s++) {
      store[s].product = await productModel.getProductWithFile(
        store[s].product_id
      );
      if (store[s].product) {
        store[s].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          symbol: store[s].product.symbol,
          unit: store[s].product.unit,
          quantity: store[s].quantity,
          price: (store[s].price * store[s].quantity).toFixed(2),
          current_rate: store[s].product.price,
        };
      }
    }
  }
  // My Order
  const order = await orderModel.getByStatus(req.body.user_id, [
    "collect",
    "deliver",
  ]);
  if (order) {
    for (var o = 0; o < order.length; o++) {
      order[o].product = await productModel.getProductWithFile(
        order[o].product_id
      );
      if (order[o].product) {
        order[o].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          symbol: order[o].product.symbol,
          unit: order[o].product.unit,
          quantity: order[o].quantity,
          price: (order[o].price * order[o].quantity).toFixed(2),
          current_rate: order[o].product.price,
        };
      }
    }
  }
  let result = {
    my_stake: stake,
    my_store: store,
    my_order: order
  };
  return res.status(200).json({ data: result });
};
