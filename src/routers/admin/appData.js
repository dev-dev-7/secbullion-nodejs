const express = require("express");
const router = express.Router();
const appDataController = require("../../components/appData/admin/appDataController");
const validation = require("../../helpers/validation/appData");
const verifyToken = require("../../helpers/verifyToken");

// Category
router
  .route("/app-data")
  .post([verifyToken, validation.add], appDataController.add)
  .get(appDataController.getAll);
router
  .route("/app-data/:id")
  .put([verifyToken, validation.update], appDataController.update)
  .delete([verifyToken], appDataController.delete);

module.exports = router;
