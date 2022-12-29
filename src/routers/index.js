const express = require("express");
const router = express.Router();

const auth = require("./auth");

//Admin
const adminAuth = require("./admin/auth");
const adminCategory = require("./admin/category");
const adminProduct = require("./admin/product");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome to the secbullion API");
});

router.use("/", auth);
router.use("/admin", adminAuth);
router.use("/admin", adminCategory);
router.use("/admin", adminProduct);

module.exports = router;
