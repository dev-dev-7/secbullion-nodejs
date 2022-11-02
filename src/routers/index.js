const express = require("express");
const router = express.Router();
const auth = require("./auth");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome to the secbullion API");
});

router.use("/", auth);

module.exports = router;
