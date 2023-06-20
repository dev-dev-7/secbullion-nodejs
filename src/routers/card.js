const express = require("express");
const router = express.Router();
const cardController = require("../components/card/cardController");
const verifyToken = require("../helpers/verifyToken");

// Category
router.route("/cards").get([verifyToken], cardController.get);

module.exports = router;
