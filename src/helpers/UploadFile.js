const { Storage } = require("@google-cloud/storage");
const DB = require("../models/FileModel");
const storage = new Storage();
// const storage = new Storage({
//   keyFilename: "cardz-ly-87bd1efab582.json",
// });
// TODO edit access control to this bucket
const bucketName = "secbullion-files";
const bucket = storage.bucket(bucketName); // should be your bucket name

exports.upload = async (files) => {
  const urls = [];
  let promises = [];

  // console.log(storage);

  // return;
  files.forEach((file) => {
    const { originalname, buffer } = file;
    const fileName = originalname.replace(/ /g, "_");

    // const blob = bucket.file(fileName);
    // const blobStream = blob.createWriteStream({
    //   resumable: false,
    // });

    const promise = bucket.file(fileName).save(buffer);

    console.log(`${fileName} uploaded `);
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    const res = DB.insertFileData({ url: publicUrl });
    urls.push(publicUrl);

    promise.catch(console.error);

    promises.push(promise);
    // promises.push(
    //   new Promise((resolve, reject) => {
    //     blobStream
    //       .on("finish", () => {
    //         const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    //         const res = DB.insertFileData({ url: publicUrl });
    //         urls.push(publicUrl);
    //         console.log(publicUrl);
    //         resolve();
    //       })
    //       .on("error", () => {
    //         console.error(`Unable to upload image, something went wrong`);
    //         reject(`Unable to upload image, something went wrong`);
    //       })
    //       .end(files.buffer);
    //   })
    // );
  });

  return Promise.all(promises)
    .then(() => urls)
    .catch((err) => {
      console.log(err);
      return [err];
    });
};
