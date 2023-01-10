const model = require("./categoryModel");

exports.getAll = async (req, res) => {
  const category = await model.getActive();
  return res.status(201).json({ data: category });
};
