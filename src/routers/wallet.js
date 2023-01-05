const express = require("express");
const router = express.Router();
const walletController = require("../components/wallet/walletController");
const verifyToken = require("./../helpers/verifyToken");

// Wallet
router.route("/wallet/:user_id").get([verifyToken], walletController.get);

module.exports = router;
