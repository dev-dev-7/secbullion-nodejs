const orderModel = require("./orderModel");
const productModel = require("../product/productModel");
const { validationResult } = require("express-validator");

exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let existOrder = await orderModel.getByTaxnId(req.body.txn_token);
  if (!existOrder) {
    let order = await orderModel.create(req.body);
    if (order) {
      var arr = Object.entries(req.body.items);
      for (var i = 0; i < arr.length; i++) {
        await orderModel.insertOrderDetails(
          req.body.user_id,
          order.id,
          req.body.items[i]
        );
      }
    }
    return res.status(201).json({ msg: "order has been succesfully placed" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.getMyStake = async (req, res) => {
  const product = await orderModel.getByType(req.params.user_id, ["stake"]);
  if (product) {
    for (var i = 0; i < product.length; i++) {
      product[i].product = await productModel.getById(product[i].product_id);
      if (product[i].product) {
        product[i].product.files = await productModel.getByFilesByProduct(
          product[i].product_id
        );
      }
    }
  }
  return res.status(201).json({ data: product });
};

exports.getMyStore = async (req, res) => {
  const product = await orderModel.getByType(req.params.user_id, ["store"]);
  if (product) {
    for (var i = 0; i < product.length; i++) {
      product[i].product = await productModel.getById(product[i].product_id);
      if (product[i].product) {
        product[i].product.files = await productModel.getByFilesByProduct(
          product[i].product_id
        );
      }
    }
  }
  return res.status(201).json({ data: product });
};

exports.getMyOrder = async (req, res) => {
  const product = await orderModel.getByType(req.params.user_id, [
    "collect",
    "deliver",
    "delivered",
  ]);
  if (product) {
    for (var i = 0; i < product.length; i++) {
      product[i].product = await productModel.getById(product[i].product_id);
      if (product[i].product) {
        product[i].product.files = await productModel.getByFilesByProduct(
          product[i].product_id
        );
      }
      product[i].deliver_at = product[i].updated_at;
    }
  }
  return res.status(201).json({ data: product });
};

exports.changeMyOrderStatus = async (req, res) => {
  let result;
  let product = await orderModel.getByUserProduct(
    req.body.product_order_id,
    req.params.user_id,
    req.body.product_id
  );
  if (product.status != "delivered") {
    result = await orderModel.updateProduct(
      product.id,
      product.user_id,
      product.product_id,
      req.body
    );
  }
  if (result) {
    return res.status(201).json({ data: result });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
