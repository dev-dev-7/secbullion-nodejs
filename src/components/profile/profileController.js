const model = require("./profileModel");
const { validationResult } = require("express-validator");

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  await model.updateUserMetaData(
    req.params.user_id,
    "username",
    req.body.username
  );
  let existUsername = await model.getUserMetaDataKeyValueExist(
    req.params.user_id,
    "tagname",
    req.body.tagname
  );
  if (!existUsername) {
    await model.updateUserMetaData(
      req.params.user_id,
      "tagname",
      req.body.tagname
    );
  } else {
    return res.status(400).json({ errors: [{ msg: "Username taken" }] });
  }
  await model.updateUserMetaData(req.params.user_id, "photo", req.body.photo);
  return res
    .status(201)
    .json({ data: await model.getUserMetaData(req.params.user_id) });
};
