require("dotenv").config();
const orderModel = require("../orderModel");
const productModel = require("../../product/productModel");
const profileModel = require("../../profile/profileModel");
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
          orders[i].details[j].product = await productModel.getProduct(
            orders[i].details[j].product_id
          );
          orders[i].details[j].delivery_address = await profileModel.getMetaDataById(orders[i].details[j].delivery_id);
        }
        orders[i].user = await authModel.getUserById(orders[i].user_id);
        if (orders[i].user) {
          orders[i].user.metadata = await profileModel.getUserMetaData(
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
  let existOrder = await orderModel.getOrderById(req.params.order_id);
  if (existOrder) {
    await orderModel.updateOrderStatus(
      req.params.order_id,
      req.body.status
    );
    return res.status(201).json({ msg: "Order status has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.changeMyOrderItemStatus = async (req, res) => {
  req.body.currency = process.env.DEFAULT_CURRENCY;
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
      }else{
        if (req.body.quantity < selectedProduct.quantity) {
          // Minus from selected item
          await orderModel.updateOrderProductQuantity(
            selectedProduct.id,
            selectedProduct.quantity - req.body.quantity
          );
          // insert new item if not exist
          await orderModel.insertOrderDetails(
            selectedProduct.user_id,
            selectedProduct.order_id,
            req.body
          );
        } else if (req.body.quantity == selectedProduct.quantity) {
          // update product everything
          await orderModel.updateOrderProduct(
            selectedProduct.id,
            req.body
          );
        }
      }
    }
    return res.status(201).json({ msg: "Order has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
