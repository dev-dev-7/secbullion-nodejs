const express = require("express");
const router = express.Router();
const cardController = require("../components/card/cardController");
const verifyToken = require("../helpers/verifyToken");
const validation = require("../helpers/validation/card");

// Card
router.route("/cards").get([verifyToken], cardController.get);
router.route("/card/:id").delete([verifyToken], cardController.delete);
router
  .route("/card")
  .post([verifyToken, validation.card], cardController.create);

module.exports = router;
