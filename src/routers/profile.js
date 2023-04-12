const express = require("express");
const router = express.Router();
const profileController = require("../components/profile/profileController");
const validation = require("../helpers/validation/auth");
const verifyToken = require("./../helpers/verifyToken");

router
  .route("/profile/:user_id")
  .get([verifyToken], profileController.get)
  .put([verifyToken], profileController.update);

router
  .route("/profile/address/:user_id")
  .post([verifyToken, validation.add_address], profileController.addAddress)
  .get([verifyToken], profileController.getAllAddress)
  .put([verifyToken, validation.put_address], profileController.updateAddress)
  .delete(
    [verifyToken, validation.delete_address],
    profileController.deleteAddress
  );
module.exports = router;
