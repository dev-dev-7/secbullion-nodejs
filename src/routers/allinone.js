const express = require("express");
const router = express.Router();
const allinoneController = require("../components/allInOne/allinone");

// Allinone
router.route("/all-in-one").get(allinoneController.getAll);

module.exports = router;
