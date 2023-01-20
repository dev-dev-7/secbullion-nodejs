const express = require("express");
const router = express.Router();
const transactionController = require("../components/transaction/transactionController");
const validation = require("../helpers/validation/transaction");
const verifyToken = require("./../helpers/verifyToken");

// Transaction
router
  .route("/bank-transaction")
  .post([verifyToken, validation.create], transactionController.create);
router
  .route("/bank-transaction/:user_id")
  .get([verifyToken], transactionController.get);

module.exports = router;
