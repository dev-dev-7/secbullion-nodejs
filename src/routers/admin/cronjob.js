const express = require("express");
const router = express.Router();
const cronjobController = require("../../components/cronjob/cronjob");

// Cronjob
router.route("/mt5-price-update").get(cronjobController.priceUpdate);
router.route("/mt5-swap-update").get(cronjobController.stakeUpdate);
router.route("/mt5-test").get(cronjobController.test);

module.exports = router;
