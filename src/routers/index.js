const express = require("express");
const router = express.Router();

const auth = require("./auth");
const profile = require("./profile");
const category = require("./category");
const authAllInOne = require("./allinone");
const cart = require("./cart");
const wallet = require("./wallet");
const order = require("./order");

//Admin
const adminAuth = require("./admin/auth");
const adminCategory = require("./admin/category");
const adminProduct = require("./admin/product");
const fileProduct = require("./admin/file");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome to the secbullion API");
});

router.use("/", auth);
router.use("/", profile);
router.use("/", category);
router.use("/", authAllInOne);
router.use("/", cart);
router.use("/", wallet);
router.use("/", order);
router.use("/admin", adminAuth);
router.use("/admin", adminCategory);
router.use("/admin", adminProduct);
router.use("/admin", fileProduct);

module.exports = router;
