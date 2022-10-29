import express from "express";
import fileUploadController from "../../components/fileUpload/fileUpload.controller.js";
var router = express.Router();

// *****************************************************************************
// PROTECT JWT
// router.use(authController.protect);

router.post("/upload", fileUploadController.uploadMultiFiles);

router.get("/list", fileUploadController.getListFiles);
router.get("/:name", fileUploadController.download);

export default router;
