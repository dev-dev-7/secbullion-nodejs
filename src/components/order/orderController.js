require("dotenv").config();
const orderModel = require("./orderModel");
const cartModel = require("./../cart/cartModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const profileModel = require("../profile/profileModel");
const appDataModel = require("../appData/appDataModel");
const { validationResult } = require("express-validator");
const { buyPosition, getSingleSymbolPrice } = require("../../helpers/mt5");
const { updateWalletAmount } = require("../../helpers/updateWallet");
const { authorization } = require("../../helpers/authorization");

async function getGrandTotal(cartItems, coupon_code = "") {
  let coupon = await cartModel.getCoupon(coupon_code);
  let discount_price = coupon ? coupon.discount_price : 0;
  let grandTotal = 0;
  let delivery_fee = 0;
  if (cartItems.length) {
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].type === "deliver") {
        let deliveryFee = await appDataModel.getByMetaKey("delivery-fee");
        delivery_fee = parseInt(deliveryFee?.meta_values);
      }
      grandTotal += cartItems[i].price * cartItems[i].quantity;
    }
  }
  return {
    subTotal: grandTotal,
    grandTotal: grandTotal - discount_price + delivery_fee,
    coupon_used: discount_price,
    delivery_fee: delivery_fee,
  };
}

exports.orderSummary = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authorization(req, res);
  const order = {};
  let cartItems = await cartModel.getCartByUserId(user.user_id);
  if (cartItems) {
    if (cartItems.length) {
      for (var i = 0; i < cartItems.length; i++) {
        let product = await productModel.getById(cartItems[i].product_id);
        if (product) {
          cartItems[i].product = product;
          cartItems[i].product.files = await productModel.getByFilesByProduct(
            cartItems[i].product_id
          );
          cartItems[i].price = product.last_price;
        }
      }
    }
    let sum = await getGrandTotal(cartItems, req.body.coupon_code);
    order.currency = process.env.DEFAULT_CURRENCY;
    order.subtotal = sum.subTotal;
    order.coupon_used = sum.coupon_used;
    order.total = sum.grandTotal;
    order.delivery_fee = sum.delivery_fee;
    order.items = cartItems;
    return res.status(201).json({ data: order });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authorization(req, res);
  let cartItems = await cartModel.getCartByUserId(user.user_id);
  if (cartItems?.length) {
    for (var i = 0; i < cartItems.length; i++) {
      let product = await productModel.getById(cartItems[i].product_id);
      if (product) {
        cartItems[i].product = product;
        let symbolLatestPrice = await getSingleSymbolPrice(cartItems[i].symbol);
        cartItems[i].price = cartItems[i].product.last_price;
        cartItems[i].order_price = symbolLatestPrice[0].Ask;
      }
    }
  } else {
    return res.status(400).json({ errors: [{ msg: "Invalid Request" }] });
  }
  // Payment Start
  let sum = await getGrandTotal(cartItems, req.body.coupon_code);
  if (req.body.payment_method == "wallet") {
    let wallet = await walletModel.getWalletByUserId(user.user_id);
    if (wallet.cash_balance < sum.grandTotal) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Not enough wallet balance" }] });
    }
  } else if (req.body.payment_method == "checkout") {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
  // Payment End
  req.body.user_id = user.user_id;
  req.body.subtotal = sum.subTotal;
  req.body.total = sum.grandTotal;
  req.body.currency = process.env.DEFAULT_CURRENCY;
  req.body.txn_token = "wallet";
  req.body.discount_price = sum.coupon_used;
  req.body.delivery_fee = sum.delivery_fee;
  let order = await orderModel.create(req.body);
  if (order) {
    let mt5AccountNumber = await profileModel.getUserMetaDataKey(
      user.user_id,
      "mt5_account_no"
    );
    if (cartItems.length) {
      for (var i = 0; i < cartItems.length; i++) {
        cartItems[i].currency = process.env.DEFAULT_CURRENCY;
        if (cartItems[i].type === "store" || cartItems[i].type === "stake") {
          if (mt5AccountNumber?.meta_values) {
            let mt5Order = await buyPosition(
              mt5AccountNumber.meta_values,
              cartItems[i].product.symbol,
              cartItems[i].quantity
            );
            let comment = "New%20Order%20-%20" + cartItems[i].product.symbol;
            await updateWalletAmount(
              user.user_id,
              cartItems[i].price * cartItems[i].quantity,
              "-",
              comment
            );
            if (mt5Order?.Order != 0) {
              cartItems[i].order_price = mt5Order.PriceOrder;
              cartItems[i].position_id = mt5Order.Order;
              await orderModel.insertOrderDetails(
                user.user_id,
                order.id,
                cartItems[i]
              );
            } else {
              await updateWalletAmount(
                user.user_id,
                cartItems[i].price * cartItems[i].quantity,
                "+",
                "Position%20failed%20cashback"
              );
            }
          }
        } else {
          let comment = "New%20Order%20-%20" + cartItems[i].product.symbol;
          await updateWalletAmount(
            user.user_id,
            cartItems[i].price * cartItems[i].quantity,
            "-",
            comment
          );
          cartItems[i].order_price = cartItems[i].price;
          cartItems[i].position_id = 0;
          await orderModel.insertOrderDetails(
            user.user_id,
            order.id,
            cartItems[i]
          );
        }
        await cartModel.deleteUserCart(
          user.user_id,
          cartItems[i].product_id,
          cartItems[i].type
        );
      }
    }
    if (req.body.discount_price > 0) {
      let comment = "Order%20Discount%20-%20" + order.id;
      await updateWalletAmount(
        user.user_id,
        req.body.discount_price,
        "+",
        comment
      );
    }
    if (req.body.delivery_fee > 0) {
      let comment = "Delivery%20Fee%20-%20" + order.id;
      await updateWalletAmount(
        user.user_id,
        req.body.delivery_fee,
        "+",
        comment
      );
    }
    let numOrderItems = await orderModel.getDetailsByOrderId(order.id);
    if (!numOrderItems.length) {
      await orderModel.deleteOrder(order.id);
      return res.status(400).json({ errors: [{ msg: "Error" }] });
    }
    order.items = cartItems;
    return res
      .status(201)
      .json({ data: order, msg: "order has been succesfully placed" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
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
    "sellback",
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
