const { validationResult } = require("express-validator");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const authModel = require("../auth/authModel");
const categoryModel = require("../category/categoryModel");
const cartModel = require("../cart/cartModel");
const {
  getPrice,
  getCurrentPrice,
} = require("../../helpers/mt5Commands/getProductPrice");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const wallet = await walletModel.getWalletByUserId(req.body.user_id);
  // All Products
  const products = await productModel.getActiveProducts();
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      products[p].files = await productModel.getByFilesByProduct(
        products[p].id
      );
      products[p].value = {
        currency: "AED",
        unit: products[p].unit,
        price: getPrice(products[p].quantity, products[p].unit),
        current_rate: getCurrentPrice(products[p].unit),
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
          currency: "AED",
          unit: stake[t].product.unit,
          price: getPrice(stake[t].product.quantity, stake[t].product.unit),
          current_rate: getCurrentPrice(stake[t].product.unit),
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
          currency: "AED",
          unit: store[s].product.unit,
          price: getPrice(store[s].product.quantity, store[s].product.unit),
          current_rate: getCurrentPrice(store[s].product.unit),
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
          currency: "AED",
          unit: order[o].product.unit,
          price: getPrice(order[o].product.quantity, order[o].product.unit),
          current_rate: getCurrentPrice(order[o].product.unit),
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
    cart.coupon_used = coupon ? coupon.discount_price : 0;
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
          currency: "AED",
          unit: cartItems[c].unit,
          price: getPrice(cartItems[c].quantity, cartItems[c].unit),
          current_rate: getCurrentPrice(cartItems[c].unit),
        };
        cart.subtotal += getPrice(cartItems[c].quantity, cartItems[c].unit);
      }
    }
    cart.items = cartItems;
    cart.total = cart.subtotal - cart.coupon_used;
  }
  let result = {
    currency: "AED",
    gold_rate: "12000",
    category: await categoryModel.getActive(),
    wallet: wallet,
    products: products,
    my_stake: stake,
    my_store: store,
    my_order: order,
    my_carts: cart,
    metadata: await authModel.getUserMetaData(req.body.user_id),
  };
  return res.status(200).json({ data: result });
};
