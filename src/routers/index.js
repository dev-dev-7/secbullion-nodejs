const express = require("express");
const router = express.Router();
const auth = require("./Auth");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome - Home Page");
});

router.use("/", auth);

module.exports = router;