const express = require("express");
const router = express.Router();
const auth = require("./auth");

//Admin
const adminAuth = require("./admin/auth");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome to the secbullion API");
});

router.use("/", auth);
router.use("/admin", adminAuth);

module.exports = router;
