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
  const category = await model.getAll();
  return res.status(201).json({ data: category });
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const category = await model.update(req.params.id, req.body);
  return res.status(201).json({ data: category });
};

exports.delete = async (req, res) => {
  const category = await model.remove(req.params.id);
  return res.status(201).json({ data: category });
};
