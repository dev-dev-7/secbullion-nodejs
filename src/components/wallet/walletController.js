require("dotenv").config();
const walletModel = require("./walletModel");
const orderModel = require("../order/orderModel");
const transactionModel = require("../transaction/transactionModel");
const bankDetailsModel = require("../bankDetails/bankDetailsModel");
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
    cash_balance: wallet.cash_balance.toFixed(2),
    commodities: store?.price ? store.price.toFixed(2) : "0.00",
    staking: stake?.price ? stake.price.toFixed(2) : "0.00",
  };
  if (result) {
    return res.status(200).json({ data: result });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.getTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const transactions = await transactionModel.getTransactionByUserId(
    req.params.user_id
  );
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
      );
    }
  }
  if (transactions) {
    return res.status(200).json({ data: transactions });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.checkouCallback = async (req, res) => {
  await walletModel.insertCallback("checkout", req);
  return res.status(200).json({ msg: "callback inserted." });
};
