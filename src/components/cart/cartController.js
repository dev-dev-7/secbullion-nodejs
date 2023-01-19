const cartModel = require("./cartModel");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let items = req.body.items;
  if (items.length) {
    for (var i = 0; i < items.length; i++) {
      let existCart = await cartModel.getUserCartProductByType(
        req.body.user_id,
        req.body.product_id,
        items[i].type
      );
      if (existCart) {
        if (items[i].quantity == 0) {
          await cartModel.deleteUserCart(
            req.body.user_id,
            req.body.product_id,
            items[i].type
          );
        } else {
          await cartModel.update(
            req.body.user_id,
            req.body.product_id,
            items[i].type,
            items[i]
          );
        }
      } else {
        if (items[i].quantity != 0) {
          await cartModel.create(
            req.body.user_id,
            req.body.product_id,
            items[i]
          );
        }
      }
    }
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
  let existCart = await cartModel.getUserCartProductByType(
    req.params.user_id,
    req.body.product_id,
    req.body.type
  );
  if (existCart) {
    let carts = await cartModel.update(
      req.params.user_id,
      req.body.product_id,
      req.body.type,
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
    req.params.product_id,
    req.params.type
  );
  if (del) {
    return res
      .status(200)
      .json({ data: await cartModel.getCartByUserId(req.params.user_id) });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
