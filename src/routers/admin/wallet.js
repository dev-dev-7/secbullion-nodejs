const express = require("express");
const router = express.Router();
const walletController = require("../../components/wallet/admin/walletController");
const verifyToken = require("../../helpers/verifyToken");
const validation = require("../../helpers/validation/wallet");

router
  .route("/wallet/withdraw")
  .get([verifyToken], walletController.get);

router
  .route("/wallet/withdraw/accept")
  .post([verifyToken, validation.withdrawAccept], walletController.withdrawAccept);


module.exports = router;
