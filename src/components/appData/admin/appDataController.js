const model = require("./../appDataModel");
const { validationResult } = require("express-validator");

exports.add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let metadata;
  metadata = await model.getByMetaKey(req.body.meta_key);
  if (!metadata) {
    metadata = await model.create(req.body);
  }
  return res.status(201).json({ data: metadata });
};

exports.getAll = async (req, res) => {
  const appData = await model.getAll();
  return res.status(201).json({ data: appData });
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const appData = await model.update(req.params.id, req.body);
  return res.status(201).json({ data: appData });
};

exports.delete = async (req, res) => {
  const appData = await model.remove(req.params.id);
  return res.status(201).json({ data: appData, msg:"App data has been successfully deleted." });
};
