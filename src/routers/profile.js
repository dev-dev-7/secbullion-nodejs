const express = require("express");
const router = express.Router();
const verifyToken = require("./../helpers/verifyToken");
const profileController = require("../components/profile/profileController");

router.post("/profile", [verifyToken], profileController.update);
module.exports = router;
