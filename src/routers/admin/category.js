const express = require("express");
const router = express.Router();
const categoryController = require("../../components/category/admin/categoryController");
const validation = require("../../helpers/validation/category");
const verifyToken = require("./../../helpers/verifyToken");

// Category
router
  .route("/category")
  .post([verifyToken, validation.add], categoryController.add)
  .get(categoryController.getAll);
router
  .route("/category/:id")
  .put([verifyToken, validation.update], categoryController.update)
  .delete([verifyToken], categoryController.delete);

module.exports = router;
