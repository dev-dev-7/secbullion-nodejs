const { validationResult } = require("express-validator");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const authModel = require("../auth/authModel");
const categoryModel = require("../category/categoryModel");
const { getPrice } = require("../../helpers/mt5Commands/getProductPrice");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const wallet = await walletModel.getWalletByUserId(req.body.user_id);
  const products = await productModel.getActiveProducts();
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      products[p].files = await productModel.getByFilesByProduct(
        products[p].id
      );
      products[p].value = {
        currency: "AED",
        price: getPrice(products[p].quantity, products[p].unit),
      };
    }
  }
  // My Stake
  const stake = await orderModel.getByType(req.body.user_id, ["stake"]);
  if (stake) {
    for (var i = 0; i < stake.length; i++) {
      stake[i].product = await productModel.getById(stake[i].product_id);
      if (stake[i].product) {
        stake[i].product.files = await productModel.getByFilesByProduct(
          stake[i].product_id
        );
        stake[i].product.value = {
          currency: "AED",
          price: getPrice(stake[i].product.quantity, stake[i].product.unit),
        };
      }
    }
  }
  // My Store
  const store = await orderModel.getByType(req.body.user_id, ["store"]);
  if (store) {
    for (var i = 0; i < store.length; i++) {
      store[i].product = await productModel.getById(store[i].product_id);
      if (store[i].product) {
        store[i].product.files = await productModel.getByFilesByProduct(
          store[i].product_id
        );
        store[i].product.value = {
          currency: "AED",
          price: getPrice(store[i].product.quantity, store[i].product.unit),
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
    for (var i = 0; i < order.length; i++) {
      order[i].product = await productModel.getById(order[i].product_id);
      if (order[i].product) {
        order[i].product.files = await productModel.getByFilesByProduct(
          order[i].product_id
        );
        order[i].product.value = {
          currency: "AED",
          price: getPrice(order[i].product.quantity, order[i].product.unit),
        };
      }
    }
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
    metadata: await authModel.getUserMetaData(req.body.user_id),
  };
  return res.status(200).json({ data: result });
};
