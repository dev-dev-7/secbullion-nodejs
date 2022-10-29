import util from "util";
import multer from "multer";
const maxSize = 20 * 1024 * 1024;

const Multer = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxSize },
});

const uploadSingleFile = Multer.single("file");

const uploadMultiFiles = Multer.array("files", 10);

// const uploadMultiFields = Multer.fields([
//   { name: "avatar", maxCount: 1 },
//   { name: "gallery", maxCount: 8 },
// ]);

export const uploadSingleMiddleware = util.promisify(uploadSingleFile);
export const uploadMultiFilesMiddleware = util.promisify(uploadMultiFiles);

// module.exports = Multer;
