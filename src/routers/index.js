const express = require("express");
const router = express.Router();
const auth = require("./Auth");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome to Cardzly API v1 - Home Page");
});

router.use("/", auth);

module.exports = router;
