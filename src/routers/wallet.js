const express = require("express");
const router = express.Router();
const walletController = require("../components/wallet/walletController");
const verifyToken = require("./../helpers/verifyToken");
const validation = require("../helpers/validation/checkout");

// Wallet
router.route("/wallet/:user_id").get([verifyToken], walletController.get);
router.route("/wallet/checkout/callback").get(walletController.checkouCallback);
router
  .route("/wallet/checkout/payment")
  .post([verifyToken, validation.payment], walletController.payment);

// Transactions
router
  .route("/transactions/:user_id")
  .get([verifyToken], walletController.getTransaction);

module.exports = router;
