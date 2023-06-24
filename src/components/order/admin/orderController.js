require("dotenv").config();
const { validationResult } = require("express-validator");
const { authorization } = require("../../../helpers/authorization");
const orderModel = require("../orderModel");
const productModel = require("../../product/productModel");
const profileModel = require("../../profile/profileModel");
const { sellPosition, buyPosition } = require("../../../helpers/mt5");
const { updateWalletAmount } = require("../../../helpers/updateWallet");

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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let user = await authorization(req, res);
  let existOrder = await orderModel.getOrderById(req.params.order_id);
  if (existOrder) {
    await orderModel.updateOrderStatus(
      req.params.order_id,
      req.body.status,
      user.user_id
    );
    return res
      .status(201)
      .json({ msg: "Order status has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.changeMyOrderItemStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const userMetadata = await profileModel.getUserMetaDataKey(
    req.params.user_id,
    "mt5_account_no"
  );
  req.body.currency = process.env.DEFAULT_CURRENCY;
  let selectedProduct = await orderModel.isExistOrderProduct(
    req.body.order_product_id,
    req.params.user_id,
    req.body.product_id
  );
  if (selectedProduct) {
    // MT5 Command Execution start
    let sellBackId = 0;
    let position;
    if (req.body.status == "sellback") {
      position = await sellPosition(
        userMetadata.meta_values,
        selectedProduct.symbol,
        req.body.quantity,
        selectedProduct.mt5_position_id
      );
      if (position?.ResultDealerBid > 0) {
        let comment =
          "Sellback%20" +
          selectedProduct.symbol +
          "%20x%20" +
          req.body.quantity;
        let sellbackprice = selectedProduct.order_price * req.body.quantity;
        await updateWalletAmount(
          req.params.user_id,
          sellbackprice,
          "+",
          comment
        );
        let product = await productModel.getById(selectedProduct.product_id);
        if (product?.commission > 0) {
          let totalCommision = req.body.quantity * product.commission;
          await updateWalletAmount(
            req.params.user_id,
            totalCommision,
            "-",
            "Commission%20" +
              selectedProduct.symbol +
              "%20x%20" +
              req.body.quantity
          );
        }
      }
    }
    // UPDATE WALLET AMOUNT IN CASE POSITION CLOSED

    // DB Execution start
    if (
      selectedProduct.status != req.body.status &&
      req.body.quantity <= selectedProduct.quantity
    ) {
      if (req.body.quantity < selectedProduct.quantity) {
        if (req.body.status == "stake" || req.body.status == "store") {
          await sellPosition(
            userMetadata.meta_values,
            selectedProduct.symbol,
            req.body.quantity,
            selectedProduct.mt5_position_id
          );
          position = await buyPosition(
            userMetadata.meta_values,
            selectedProduct.symbol,
            req.body.quantity
          );
        }
        // insert new item
        req.body.type = req.body.status;
        let inserted = await orderModel.insertOrderDetails(
          selectedProduct.user_id,
          selectedProduct.order_id,
          req.body
        );
        if (inserted) {
          sellBackId = inserted.id;
          if (position?.Order) {
            await orderModel.updateOrderProductTicketId(
              inserted.id,
              position?.Order,
              position?.PriceOrder
            );
          }
          // Minus from selected item
          await orderModel.updateOrderProductQuantity(
            selectedProduct.id,
            selectedProduct.quantity - req.body.quantity
          );
        }
      } else if (req.body.quantity == selectedProduct.quantity) {
        // convert product to new status with same quantity
        let updated = await orderModel.updateOrderProduct(
          selectedProduct.id,
          req.body
        );
        sellBackId = updated.id;
      }
      if (sellBackId && req.body.status == "sellback" && position) {
        await orderModel.updateOrderProductLatestPrice(
          sellBackId,
          position?.ResultDealerBid
        );
      }
    } else {
      // Update and overwrite missing details for same status
      if (req.body.quantity <= selectedProduct.quantity) {
        await orderModel.updateOrderProduct(selectedProduct.id, req.body);
      }
    }

    return res.status(201).json({
      msg: "Order has been updated successfully",
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
