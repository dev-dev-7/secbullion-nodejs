const model = require("./categoryModel");
const { validationResult } = require("express-validator");

exports.add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let category;
  category = await model.getByTitle(req.body.title);
  if (!category) {
    category = await model.create(req.body);
  }
  return res.status(201).json({ data: category });
};

exports.getActive = async (req, res) => {
  const category = await model.getActive();
  return res.status(201).json({ data: category });
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
