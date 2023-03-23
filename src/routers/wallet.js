const express = require("express");
const router = express.Router();
const walletController = require("../components/wallet/walletController");
const verifyToken = require("./../helpers/verifyToken");

// Wallet
router.route("/wallet/:user_id").get([verifyToken], walletController.get);

// Transactions
router.route("/transactions/:user_id").get([verifyToken], walletController.getTransaction);

module.exports = router;
