const express = require("express");
const router = express.Router();
const allinoneController = require("../components/allInOne/allinone");
const validation = require("../helpers/validation/allinone");
const verifyToken = require("./../helpers/verifyToken");

// Allinone
router
  .route("/all-in-one")
  .post([verifyToken, validation.getAll], allinoneController.getAll);

module.exports = router;
