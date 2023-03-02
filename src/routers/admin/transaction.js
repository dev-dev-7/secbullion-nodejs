const express = require("express");
const router = express.Router();
const transactionController = require("../../components/transaction/admin/transactionController");
const validation = require("../../helpers/validation/transaction");
const verifyToken = require("./../../helpers/verifyToken");

// Transaction
router
  .route("/bank-transactions")
  .get([verifyToken], transactionController.get);
router
  .route("/bank-transaction/:transaction_id")
  .put([verifyToken], transactionController.update);

module.exports = router;
