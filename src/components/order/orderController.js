const orderModel = require("./orderModel");
const cartModel = require("./../cart/cartModel");
const productModel = require("../product/productModel");
const { validationResult } = require("express-validator");
const { getPrice } = require("../../helpers/mt5Commands/getProductPrice");

exports.orderSummary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let order = {};
  let cartItems = await cartModel.getCartByUserId(req.body.user_id);
  if (cartItems) {
    order.items = cartItems;
    order.subtotal = 0;
    order.coupon_used = req.body.coupon_code == "SEC50" ? 50 : 0;
    order.total = 0;
    if (cartItems.length) {
      for (var i = 0; i < cartItems.length; i++) {
        cartItems[i].product = await productModel.getById(
          cartItems[i].product_id
        );
        cartItems[i].product.files = await productModel.getByFilesByProduct(
          cartItems[i].product_id
        );
        order.subtotal += getPrice(cartItems[i].quantity, cartItems[i].unit);
      }
    }
    order.total = order.subtotal - order.coupon_used;
    return res.status(201).json({ data: order });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

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
  let product = await orderModel.getByUserProduct(
    req.body.product_order_id,
    req.params.user_id,
    req.body.product_id
  );
  if (product) {
    if (product.status == "stake" && req.body.status == "store") {
      await orderModel.updateProduct(
        product.id,
        product.user_id,
        product.product_id,
        req.body
      );
    } else if (product.status == "store" && req.body.status == "stake") {
      if (req.body.quantity < product.quantity) {
        let existStake = await orderModel.getUserOrderByType(
          product.user_id,
          "stake"
        );
        if (existStake) {
          await orderModel.updateProduct(
            existStake.id,
            existStake.user_id,
            existStake.product_id,
            req.body
          );
        } else {
          await orderModel.insertOrderDetails(
            req.body.user_id,
            product.order_id,
            req.body
          );
        }
      } else {
        if (req.body.quantity == product.quantity) {
          await orderModel.updateProduct(
            product.id,
            product.user_id,
            product.product_id,
            req.body
          );
        }
      }
    } else if (product.status == "store" && req.body.status == "deliver") {
      if (req.body.quantity < product.quantity) {
        let existDeliver = await orderModel.getUserOrderByType(
          product.user_id,
          "deliver"
        );
        if (existDeliver) {
          await orderModel.updateProduct(
            existDeliver.id,
            existDeliver.user_id,
            existDeliver.product_id,
            req.body
          );
        } else {
          await orderModel.insertOrderDetails(
            req.body.user_id,
            product.order_id,
            req.body
          );
        }
      } else {
        if (req.body.quantity == product.quantity) {
          await orderModel.updateProduct(
            product.id,
            product.user_id,
            product.product_id,
            req.body
          );
        }
      }
    } else if (product.status == "store" && req.body.status == "collect") {
      if (req.body.quantity < product.quantity) {
        let existCollect = await orderModel.getUserOrderByType(
          product.user_id,
          "collect"
        );
        if (existCollect) {
          await orderModel.updateProduct(
            existCollect.id,
            existCollect.user_id,
            existCollect.product_id,
            req.body
          );
        } else {
          await orderModel.insertOrderDetails(
            req.body.user_id,
            product.order_id,
            req.body
          );
        }
      } else {
        if (req.body.quantity == product.quantity) {
          await orderModel.updateProduct(
            product.id,
            product.user_id,
            product.product_id,
            req.body
          );
        }
      }
    }
  }
  if (product) {
    return res.status(201).json({ msg: "Order has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
