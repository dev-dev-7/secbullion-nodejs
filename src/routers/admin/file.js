const express = require("express");
const router = express.Router();
const verifyToken = require("../../helpers/verifyToken");
const fileController = require("../../components/file/fileController");

router.post("/upload-file", [verifyToken], fileController.uploadMultiFiles);

module.exports = router;
