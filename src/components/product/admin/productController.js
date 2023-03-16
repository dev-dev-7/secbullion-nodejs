const model = require("../productModel");
const { validationResult } = require("express-validator");

exports.add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let product;
  product = await model.isExistProduct(req.body.symbol);
  if (!product) {
    product = await model.create(req.body);
    if (product) {
      if (req.body.files) {
        for (var i = 0; i < req.body.files.length; i++) {
          await model.insertFiles(product.id, req.body.files[i]);
        }
      }
    }
  }
  return res.status(201).json({ data: product });
};

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let products;
  if (req.body.category_id) {
    products = await model.get(req.body.category_id);
  } else {
    products = await model.get();
  }
  if (products) {
    for (i = 0; i < products.length; i++) {
      products[i].files = await model.getByFilesByProduct(products[i].id);
    }
  }
  return res.status(201).json({ data: products });
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let updated = await model.update(req.params.id, req.body);
  if(updated){
    if (req.body.files) {
      for (var i = 0; i < req.body.files.length; i++) {
        await model.insertFiles(req.params.id, req.body.files[i]);
      }
    }
  }
  return res.status(201).json({ msg: "Succesfully updated" });
};

exports.delete = async (req, res) => {
  const category = await model.remove(req.params.id);
  return res.status(201).json({ data: category });
};
