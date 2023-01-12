const express = require("express");
const router = express.Router();
const appDataController = require("../components/appData/appDataController");

// Category
router.route("/app-data").get(appDataController.appData);

module.exports = router;
