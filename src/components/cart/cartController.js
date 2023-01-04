const cartModel = require("./cartModel");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let existCart = await cartModel.getUserCartByProductId(
    req.body.user_id,
    req.body.product_id
  );
  if (existCart.length) {
    await cartModel.update(req.body.user_id, req.body.product_id, req.body);
  } else {
    await cartModel.create(req.body);
  }
  let carts = await cartModel.getCartByUserId(req.body.user_id);
  if (carts) {
    return res.status(201).json({ data: carts });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let carts = await cartModel.getCartByUserId(req.params.user_id);
  if (carts) {
    return res.status(201).json({ data: carts });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let existCart = await cartModel.getUserCartByProductId(
    req.params.user_id,
    req.body.product_id
  );
  if (existCart) {
    let carts = await cartModel.update(
      req.params.user_id,
      req.body.product_id,
      req.body
    );
    return res.status(200).json({ data: carts });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.delete = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let del = await cartModel.deleteUserCart(
    req.params.user_id,
    req.body.product_id
  );
  if (del) {
    return res
      .status(200)
      .json({ data: await cartModel.getCartByUserId(req.params.user_id) });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
