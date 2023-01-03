const model = require("./profileModel");
const authModel = require("../auth/authModel");
const { validationResult } = require("express-validator");

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authModel.getUserById(req.params.user_id);
  if (user.user_id) {
    var arr = Object.entries(req.body);
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] != "password") {
        let exist = await model.getUserMetaDataKey(user.user_id, arr[i][0]);
        if (exist) {
          await model.updateUserMetaData(user.user_id, arr[i][0], arr[i][1]);
        } else {
          await model.insertUserMetaData(user.user_id, arr[i][0], arr[i][1]);
        }
      }
    }
    return res
      .status(201)
      .json({ data: await model.getUserMetaData(req.params.user_id) });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authModel.getUserById(req.params.user_id);
  if (user.user_id) {
    return res
      .status(201)
      .json({ data: await model.getUserMetaData(req.params.user_id) });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
