import { format } from "util";
import { Storage } from "@google-cloud/storage";
import config from "../../config/index.js";
// const sharp = require("sharp");

// **************************************************************

const { BUCKET_NAME, GOOGLE_CLOUD_KEY_FILE } = config.google_storage;

// **************************************************************

// Instantiate a storage client with credentials
const storage = new Storage({ keyFilename: GOOGLE_CLOUD_KEY_FILE });
const bucket = storage.bucket(BUCKET_NAME);

// **************************************************************

const uploadMultiFiles = async (files, folder_name) => {
  try {
    let result = files.map((file) => {
      // ************************************
      let file_extention = file.originalname.substring(
        file.originalname.lastIndexOf("."),
        file.originalname.length
      );

      file.file_name = Date.now() + file_extention;

      console.log("file:", file);

      const { originalname, file_name } = file;

      // ************************************

      const blob = bucket.file(folder_name + file_name);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
        resumable: false,
      });

      // ************************************
      return new Promise(async (resolve, reject) => {
        // let buffer = await sharp(file.buffer)
        //   .resize(2000, 1333)
        //   .toFormat("jpeg")
        //   .jpeg({ quality: 90 })
        //   .toBuffer();

        blobStream
          .on("error", (err) => {
            console.error(err);
            reject({ message: err.message });
          })
          .on("finish", async (data) => {
            try {
              let publicUrl = "";

              publicUrl = format(
                `https://storage.googleapis.com/${bucket.name}/${blob.name}`
              );

              // console.log("folder_name : ", folder_name);

              await bucket.file(folder_name + file_name).makePublic();

              resolve({
                file_name: file_name,
                originalname: originalname,
                type: file?.mimetype,
                public_url: publicUrl,
                size: file?.size,
              });
            } catch (err) {
              console.error("error : ", err);
              reject({
                message: err.message,
              });
            }
          })
          .end(file.buffer);
      });
    });
    return Promise.all(result);

    // ************************************
  } catch (err) {
    console.error("error : ", err);
    throw new Error(err.message);
  }
};

const fileUploadService = { uploadMultiFiles };

export default fileUploadService;
