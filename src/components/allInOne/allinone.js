const { validationResult } = require("express-validator");
const categoryModel = require("../category/categoryModel");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const authModel = require("../auth/authModel");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const wallet = await walletModel.getWalletByUserId(req.body.user_id);
  const category = await categoryModel.getActive();
  if (category.length) {
    for (var i = 0; i < category.length; i++) {
      category[i].products = await productModel.getActiveByCategory(
        category[i].id
      );
      if (category[i].products.length) {
        for (var p = 0; p < category[i].products.length; p++) {
          category[i].products[p].files =
            await productModel.getByFilesByProduct(category[i].products[p].id);
          category[i].products[p].value = { currency: "AED", price: "56.07" };
        }
      }
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
      }
    }
  }
  let result = {
    currency: "AED",
    gold_rate: "12000",
    wallet: wallet,
    items: category,
    my_stake: stake,
    my_store: store,
    my_order: order,
    metadata: await authModel.getUserMetaData(req.body.user_id),
  };
  return res.status(201).json({ data: result });
};
