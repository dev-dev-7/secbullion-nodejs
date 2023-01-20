require("dotenv").config();
const { validationResult } = require("express-validator");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const authModel = require("../auth/authModel");
const categoryModel = require("../category/categoryModel");
const cartModel = require("../cart/cartModel");
const transactionModel = require("../transaction/transactionModel");
const bankDetailsModel = require("../bankDetails/bankDetailsModel");
const { getGramPrice } = require("../../helpers/mt5Commands/getProductPrice");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let todayGoldRate = await getGramPrice(1);
  const wallet = await walletModel.getWalletByUserId(req.body.user_id);
  // All Products
  const products = await productModel.getActiveProducts();
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      products[p].files = await productModel.getByFilesByProduct(
        products[p].id
      );
      products[p].value = {
        currency: process.env.DEFAULT_CURRENCY,
        unit: products[p].unit,
        price: todayGoldRate * products[p].quantity,
        current_rate: todayGoldRate,
      };
    }
  }
  // My Stake
  const stake = await orderModel.getByType(req.body.user_id, ["stake"]);
  if (stake) {
    for (var t = 0; t < stake.length; t++) {
      stake[t].product = await productModel.getById(stake[t].product_id);
      if (stake[t].product) {
        stake[t].product.files = await productModel.getByFilesByProduct(
          stake[t].product_id
        );
        stake[t].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: stake[t].product.unit,
          price: todayGoldRate * stake[t].product.quantity,
          current_rate: todayGoldRate,
        };
      }
    }
  }
  // My Store
  const store = await orderModel.getByType(req.body.user_id, ["store"]);
  if (store) {
    for (var s = 0; s < store.length; s++) {
      store[s].product = await productModel.getById(store[s].product_id);
      if (store[s].product) {
        store[s].product.files = await productModel.getByFilesByProduct(
          store[s].product_id
        );
        store[s].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: store[s].product.unit,
          price: todayGoldRate * store[s].product.quantity,
          current_rate: todayGoldRate,
        };
      }
    }
  }
  // My Order
  const order = await orderModel.getByType(req.body.user_id, [
    "collect",
    "deliver",
  ]);
  if (order) {
    for (var o = 0; o < order.length; o++) {
      order[o].product = await productModel.getById(order[o].product_id);
      if (order[o].product) {
        order[o].product.files = await productModel.getByFilesByProduct(
          order[o].product_id
        );
        order[o].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: order[o].product.unit,
          price: todayGoldRate * order[o].product.quantity,
          current_rate: todayGoldRate,
        };
      }
    }
  }
  // My Carts
  const cart = {};
  const cartItems = await cartModel.getCartByUserId(req.body.user_id);
  let coupon = await cartModel.getCoupon(req.body.coupon_code);
  if (cartItems) {
    cart.subtotal = 0;
    cart.discount_price = coupon ? coupon.discount_price : 0;
    cart.coupon_code = req.body.coupon_code;
    cart.total = 0;
    if (cartItems.length) {
      for (var c = 0; c < cartItems.length; c++) {
        cartItems[c].product = await productModel.getById(
          cartItems[c].product_id
        );
        cartItems[c].product.files = await productModel.getByFilesByProduct(
          cartItems[c].product_id
        );
        cartItems[c].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: cartItems[c].unit,
          price: todayGoldRate * cartItems[c].product.quantity,
          current_rate: todayGoldRate,
        };
        let totalQty = todayGoldRate * cartItems[c].product.quantity;
        cart.subtotal += totalQty * cartItems[c].quantity;
      }
    }
    cart.items = cartItems;
    cart.total = cart.subtotal - cart.discount_price;
  }
  // Trnsaction
  const transactions = await transactionModel.getTransactionByUserId(
    req.body.user_id
  );
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
      );
    }
  }
  let result = {
    currency: process.env.DEFAULT_CURRENCY,
    gold_rate: todayGoldRate,
    category: await categoryModel.getActive(),
    wallet: { balance: wallet, transactions: transactions },
    products: products,
    my_stake: stake,
    my_store: store,
    my_order: order,
    my_carts: cart,
    metadata: await authModel.getUserMetaData(req.body.user_id),
  };
  return res.status(200).json({ data: result });
};
