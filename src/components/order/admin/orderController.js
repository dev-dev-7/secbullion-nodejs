require("dotenv").config();
const orderModel = require("../orderModel");
const productModel = require("../../product/productModel");
const authModel = require("../../auth/authModel");

exports.get = async (req, res) => {
  let orders = await orderModel.getAllOrders(
    req.params.page,
    req.body.status,
    req.body.order_id
  );
  if (orders) {
    for (i = 0; i < orders.length; i++) {
      orders[i].details = await orderModel.getDetailsByOrderId(orders[i].id);
      if (orders[i].details.length) {
        for (j = 0; j < orders[i].details.length; j++) {
          orders[i].details[j].product = await productModel.getById(
            orders[i].details[j].product_id
          );
          if (orders[i].details[j].product) {
            let files = await productModel.getByFilesByProduct(
              orders[i].details[j].product_id
            );
            orders[i].details[j].product.files = files ? files : [];
          }
        }
        orders[i].user = await authModel.getUserById(orders[i].user_id);
        if (orders[i].user) {
          orders[i].user.metadata = await authModel.getUserMetaData(
            orders[i].user_id
          );
        }
      }
    }
    return res.status(201).json({ data: orders });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.changeMyOrderStatus = async (req, res) => {
  req.body.currency = process.env.DEFAULT_CURRENCY;
  req.body.type = req.body.status;
  let selectedProduct = await orderModel.getByUserProduct(
    req.body.product_order_id,
    req.params.user_id,
    req.body.product_id
  );
  if (selectedProduct) {
    if (
      selectedProduct.status != req.body.status &&
      req.body.quantity <= selectedProduct.quantity
    ) {
      let exisStoretItem = await orderModel.getUserOrderByType(
        selectedProduct.user_id,
        selectedProduct.product_id,
        req.body.status
      );
      if (exisStoretItem && req.body.quantity < selectedProduct.quantity) {
        // Minus from selected product
        await orderModel.updateOrderProductQuantity(
          selectedProduct.id,
          selectedProduct.quantity - req.body.quantity
        );
        // Add for existing product
        await orderModel.updateOrderProductQuantity(
          exisStoretItem.id,
          exisStoretItem.quantity + req.body.quantity
        );
      } else if (exisStoretItem && req.body.quantity == selectedProduct.quantity) {
        //Add for existing product 
        await orderModel.updateOrderProductQuantity(
          exisStoretItem.id,
          exisStoretItem.quantity +req.body.quantity
        );
        // Delete selected product
        await orderModel.deleteUserOrderProduct(
          selectedProduct.id,
          selectedProduct.user_id
        );
      }
    }
    return res.status(201).json({ msg: "Order has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
