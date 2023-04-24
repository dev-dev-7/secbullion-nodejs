require("dotenv").config();
const orderModel = require("../orderModel");
const walletModel = require("../../wallet/walletModel");
const productModel = require("../../product/productModel");
const { closeRequest } = require("../../../helpers/mt5");

exports.get = async (req, res) => {
  let orders = await orderModel.getAllOrders();
  if (orders) {
    for (i = 0; i < orders.length; i++) {
      orders[i].items = await orderModel.getDetailsByOrderId(orders[i].id);
    }
    return res.status(201).json({ data: orders });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.changeMyOrderStatus = async (req, res) => {
  let existOrder = await orderModel.getOrderById(req.params.order_id);
  if (existOrder) {
    await orderModel.updateOrderStatus(req.params.order_id, req.body.status);
    return res
      .status(201)
      .json({ msg: "Order status has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.changeMyOrderItemStatus = async (req, res) => {
  req.body.currency = process.env.DEFAULT_CURRENCY;
  let selectedProduct = await orderModel.isExistOrderProduct(
    req.body.order_product_id,
    req.params.user_id,
    req.body.product_id
  );
  if (selectedProduct) {
    if (
      selectedProduct.status != req.body.status &&
      req.body.quantity <= selectedProduct.quantity
    ) {
      let existStatusItem = await orderModel.getUserOrderByType(
        selectedProduct.user_id,
        selectedProduct.order_id,
        selectedProduct.product_id,
        req.body.status
      );
      if (existStatusItem && req.body.quantity < selectedProduct.quantity) {
        // Minus from selected product
        await orderModel.updateOrderProductQuantity(
          selectedProduct.id,
          selectedProduct.quantity - req.body.quantity
        );
        // Add for existing product
        req.body.quantity = existStatusItem.quantity + req.body.quantity;
        await orderModel.updateOrderProduct(existStatusItem.id, req.body);
      } else if (
        existStatusItem &&
        req.body.quantity == selectedProduct.quantity
      ) {
        //Add for existing product
        req.body.quantity = req.body.quantity + existStatusItem.quantity;
        await orderModel.updateOrderProduct(existStatusItem.id, req.body);
        // Delete selected product
        await orderModel.deleteUserOrderProduct(
          selectedProduct.id,
          selectedProduct.user_id
        );
      } else {
        if (req.body.quantity < selectedProduct.quantity) {
          // insert new item if not exist
          req.body.type = req.body.status;
          let inserted = await orderModel.insertOrderDetails(
            selectedProduct.user_id,
            selectedProduct.order_id,
            req.body
          );
          if (inserted) {
            // Minus from selected item
            await orderModel.updateOrderProductQuantity(
              selectedProduct.id,
              selectedProduct.quantity - req.body.quantity
            );
          }
        } else if (req.body.quantity == selectedProduct.quantity) {
          // convert product to new status with same quantity
          await orderModel.updateOrderProduct(selectedProduct.id, req.body);
        }
      }
    } else {
      // Update and overwrite missing details for same status
      if (req.body.quantity <= selectedProduct.quantity) {
        await orderModel.updateOrderProduct(selectedProduct.id, req.body);
      }
    }
    if (req.body.status == "sellback") {
      let product = await productModel.getById(selectedProduct.product_id);
      let wallet = await walletModel.getWalletByUserId(selectedProduct.user_id);
      let updatedWalletBalance = wallet.cash_balance + product.last_price;
      await walletModel.updateWallet(selectedProduct.user_id, {
        cash_balance: updatedWalletBalance,
      });
      await walletModel.insertWalletHistory(
        selectedProduct.user_id,
        "sellback",
        "balance",
        product.last_price,
        selectedProduct.id
      );
      // await closeRequest(selectedProduct.mt5_ticket_id);
    } else if (req.body.status == "deliver" || req.body.status == "collect") {
      // await closeRequest(selectedProduct.mt5_ticket_id);
    }
    return res.status(201).json({ msg: "Order has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
