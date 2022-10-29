import { Storage } from "@google-cloud/storage";
import config from "../../config/index.js";
import fileUploadService from "./fileUpload.service.js";
import { uploadMultiFilesMiddleware } from "../../helpers/upload.helper.js";
// import { UploadFileType } from "../enum/FileType";

// **************************************************************

const { BUCKET_NAME, GOOGLE_CLOUD_KEY_FILE } = config.google_storage;

// **************************************************************

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: GOOGLE_CLOUD_KEY_FILE });
const bucket = storage.bucket(BUCKET_NAME);

// **************************************************************

const getListFiles = async (req, res) => {
  try {
    const fileInfos = await fileUploadService.getListFiles();
    return res.status(200).json({ success: true, data: fileInfos });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// **************************************************************

const download = async (req, res) => {
  try {
    const [metaData] = await bucket.file(req.params.name).getMetadata();
    res.redirect(metaData.mediaLink);
  } catch (err) {
    res.status(500).json({
      message: "Could not download the file. " + err,
    });
  }
};

// *************************************************************************

const uploadMultiFiles = async (req, res) => {
  try {
    await uploadMultiFilesMiddleware(req, res);

    let folder_name = "";

    // if (req.body.type) {
    //   const type = req.body.type.toUpperCase();

    //   const keys = Object.keys(UploadFileType);

    //   for (var key of keys) {
    //     if (type == key) {
    //       folder_name = UploadFileType[key] + "/";
    //       break;
    //     }
    //   }
    // }

    if (!req.files) {
      return res
        .status(400)
        .send({ message: "Please select at least one file!" });
    }

    const data = await fileUploadService.uploadMultiFiles(
      req.files,
      folder_name
    );

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("error : ", err);

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(500).json({
        success: false,
        message: "Too many files to upload.",
      });
    }

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).json({
        success: false,
        message: "File size cannot be larger than 5 MB!",
      });
    }

    res.status(500).json({
      success: false,
      message: `Could not upload the file:  ${err.message}`,
    });
  }
};

// *************************************************************************

const fileUploadController = { getListFiles, download, uploadMultiFiles };

export default fileUploadController;
