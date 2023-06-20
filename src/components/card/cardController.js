const model = require("./cardModel");
const { authorization } = require("../../helpers/authorization");

exports.get = async (req, res) => {
  let user = await authorization(req, res);
  let cards = await model.getAll(user.user_id);
  return res.status(201).json({ data: cards });
};
