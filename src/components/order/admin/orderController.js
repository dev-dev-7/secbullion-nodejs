require("dotenv").config();
const orderModel = require("../orderModel");
const productModel = require("../../product/productModel");
const { validationResult } = require("express-validator");
const { getPrice } = require("../../../helpers/mt5Commands/getProductPrice");
const {
  getSymbolPrice,
} = require("../../../helpers/mt5Commands/getProductPrice");

exports.get = async (req, res) => {
  let orders = await orderModel.getAllOrders(req.params.page);
  if (orders) {
    for (i = 0; i < orders.length; i++) {
      orders[i].details = await orderModel.getDetailsByOrderId(orders[i].id);
      if (orders[i].details.length) {
        for (j = 0; j < orders[i].details.length; j++) {
          orders[i].details[j].product = await productModel.getById(
            orders[i].details[j].product_id
          );
          orders[i].details[j].product.files = await productModel.getByFilesByProduct(
            orders[i].details[j].product_id
          );
        }
      }
    }
    return res.status(201).json({ data: orders });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
