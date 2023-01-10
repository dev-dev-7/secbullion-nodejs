const express = require("express");
const router = express.Router();
const categoryController = require("../components/category/categoryController");
const verifyToken = require("../helpers/verifyToken");

// Category
router.route("/category").get([verifyToken], categoryController.getAll);

module.exports = router;
