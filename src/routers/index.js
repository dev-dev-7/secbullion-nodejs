const express = require("express");
const router = express.Router();

const auth = require("./auth");
const profile = require("./profile");
const category = require("./category");
const product = require("./product");
const allInOne = require("./allinone");
const cart = require("./cart");
const wallet = require("./wallet");
const order = require("./order");
const bankDetails = require("./bankDetails");
const transaction = require("./transaction");
const appData = require("./appData");

//Admin
const adminAuth = require("./admin/auth");
const adminDashboard = require("./admin/dashboard");
const adminCategory = require("./admin/category");
const adminProduct = require("./admin/product");
const adminOrder = require("./admin/order");
const adminTransaction = require("./admin/transaction");
const fileProduct = require("./admin/file");
const adminAppData = require("./admin/appData");
const cronjobAuth = require("./admin/cronjob");

// Home Page
router.get("/", (req, res) => {
  res.send("Welcome to the secbullion API");
});

router.use("/", auth);
router.use("/", profile);
router.use("/", category);
router.use("/", product);
router.use("/", allInOne);
router.use("/", cart);
router.use("/", wallet);
router.use("/", order);
router.use("/", bankDetails);
router.use("/", transaction);
router.use("/", appData);
router.use("/admin", adminAuth);
router.use("/admin", adminDashboard);
router.use("/admin", adminCategory);
router.use("/admin", adminProduct);
router.use("/admin", adminOrder);
router.use("/admin", adminTransaction);
router.use("/admin", fileProduct);
router.use("/admin", adminAppData);
router.use("/admin", cronjobAuth);

module.exports = router;
