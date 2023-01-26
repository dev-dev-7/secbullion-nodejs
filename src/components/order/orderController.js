require("dotenv").config();
const orderModel = require("./orderModel");
const cartModel = require("./../cart/cartModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const { validationResult } = require("express-validator");
const { getPrice } = require("../../helpers/mt5Commands/getProductPrice");
const { getSymbolPrice } = require("../../helpers/mt5Commands/getProductPrice");

exports.orderSummary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const order = {};
  let cartItems = await cartModel.getCartByUserId(req.body.user_id);
  let coupon = await cartModel.getCoupon(req.body.coupon_code);
  if (cartItems) {
    order.subtotal = 0;
    order.coupon_used = coupon ? coupon.discount_price : 0;
    order.total = 0;
    if (cartItems.length) {
      for (var i = 0; i < cartItems.length; i++) {
        cartItems[i].product = await productModel.getById(
          cartItems[i].product_id
        );
        cartItems[i].product.files = await productModel.getByFilesByProduct(
          cartItems[i].product_id
        );
        order.subtotal +=
          getPrice(cartItems[i].product.quantity, cartItems[i].product.unit) *
          cartItems[i].quantity;
      }
    }
    order.items = cartItems;
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
  if (req.body.payment_method == "wallet") {
    let wallet = await walletModel.getWalletByUserId(req.body.user_id);
    if (wallet.cash_balance < req.body.total) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Not enough wallet balance" }] });
    } else {
      let walletData = { cash_balance: wallet.cash_balance - req.body.total };
      await walletModel.updateWallet(req.body.user_id, walletData);
      req.body.txn_token =
        "wallet-" +
        req.body.user_id +
        "-" +
        wallet.cash_balance +
        "-" +
        req.body.total;
    }
  } else if (req.body.payment_method == "checkout") {
    let existOrder = await orderModel.getByTaxnId(req.body.txn_token);
    if (existOrder) {
      return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
    }
  }
  // Coupon Code
  let coupon = await cartModel.getCoupon(req.body.coupon_code);
  req.body.discount_price = coupon ? coupon.discount_price : 0;
  // Insert Order
  let order = await orderModel.create(req.body);
  if (order) {
    let itemArray = req.body.items;
    if (itemArray.length) {
      for (var i = 0; i < itemArray.length; i++) {
        let product = await productModel.getById(itemArray[i].product_id);
        itemArray[i].product = product;
        itemArray[i].price = product.last_price;
        await orderModel.insertOrderDetails(
          req.body.user_id,
          order.id,
          itemArray[i]
        );
        if (itemArray[i].product) {
          itemArray[i].product.files = await productModel.getByFilesByProduct(
            itemArray[i].product_id
          );
        }
        await cartModel.deleteUserCart(
          req.body.user_id,
          itemArray[i].product_id,
          itemArray[i].type
        );
      }
    }
    order.items = itemArray;
    //INSERT WALLET HISTORY
    await walletModel.insertWalletHistory(
      req.body.user_id,
      "balance",
      req.body.total,
      order.id
    );
  }
  return res
    .status(201)
    .json({ data: order, msg: "order has been succesfully placed" });
};

exports.getMyStake = async (req, res) => {
  const product = await orderModel.getByStatus(req.params.user_id, ["stake"]);
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
  const product = await orderModel.getByStatus(req.params.user_id, ["store"]);
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
  const product = await orderModel.getByStatus(req.params.user_id, [
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
  req.body.currency = process.env.DEFAULT_CURRENCY;
  req.body.type = req.body.status;
  let orderProduct = await orderModel.getByUserProduct(
    req.body.product_order_id,
    req.params.user_id,
    req.body.product_id
  );
  if (orderProduct) {
    req.body.price = orderProduct.price;
    let existItem = {};
    if (orderProduct.status == "stake" && req.body.status == "store") {
      existItem = await orderModel.getUserOrderByType(
        orderProduct.user_id,
        orderProduct.product_id,
        "store"
      );
    } else if (orderProduct.status == "store" && req.body.status == "stake") {
      existItem = await orderModel.getUserOrderByType(
        orderProduct.user_id,
        orderProduct.product_id,
        "stake"
      );
    } else if (orderProduct.status == "store" && req.body.status == "deliver") {
      existItem = await orderModel.getUserOrderByType(
        orderProduct.user_id,
        orderProduct.product_id,
        "deliver"
      );
    } else if (orderProduct.status == "store" && req.body.status == "collect") {
      existItem = await orderModel.getUserOrderByType(
        orderProduct.user_id,
        orderProduct.product_id,
        "collect"
      );
    }
    if (req.body.quantity <= orderProduct.quantity) {
      if (!existItem) {
        await orderModel.updateOrderProductQuantity(
          orderProduct.id,
          orderProduct.user_id,
          orderProduct.product_id,
          orderProduct.quantity + req.body.quantity
        );
      } else {
        await orderModel.insertOrderDetails(
          orderProduct.user_id,
          orderProduct.order_id,
          req.body
        );
      }
      if (req.body.quantity == orderProduct.quantity) {
        await orderModel.deleteUserOrderProduct(
          orderProduct.id,
          orderProduct.user_id
        );
      }
    }
    return res.status(201).json({ msg: "Order has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
