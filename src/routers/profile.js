const express = require("express");
const router = express.Router();
const verifyToken = require("./../helpers/verifyToken");
const profileController = require("../components/profile/profileController");

router.put("/profile/:user_id", [verifyToken], profileController.update);
router.get("/profile/:user_id", [verifyToken], profileController.get);
module.exports = router;
