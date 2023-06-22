const model = require("./cardModel");
const { authorization } = require("../../helpers/authorization");
const { validationResult } = require("express-validator");

exports.get = async (req, res) => {
  let user = await authorization(req, res);
  let cards = await model.getAll(user.user_id);
  return res.status(201).json({ data: cards });
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let user = await authorization(req, res);
  req.body.user_id = user.user_id;
  let card = await model.isExistCard(req.body);
  if (!card) {
    await model.create(req.body);
  }
  return res.status(201).json({ data: "New card created" });
};
