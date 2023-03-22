require("dotenv").config();
const walletModel = require("./walletModel");
const orderModel = require("../order/orderModel");
const { validationResult } = require("express-validator");

exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let wallet = await walletModel.getWalletByUserId(req.params.user_id);
  let store = await orderModel.getSumOfUserStack(req.params.user_id, "store");
  let stake = await orderModel.getSumOfUserStack(req.params.user_id, "stake");
  let result = {
    currency: process.env.DEFAULT_CURRENCY,
    cash_balance: (wallet.cash_balance).toFixed(2),
    commodities: (store.price).toFixed(2),
    staking: (stake.price).toFixed(2)
  }
  if (result) {
    return res.status(200).json({ data: result });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
