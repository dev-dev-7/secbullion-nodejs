require("dotenv").config();
const { validationResult } = require("express-validator");
const { authorization } = require("../../../helpers/authorization");
const orderModel = require("../orderModel");
const productModel = require("../../product/productModel");
const profileModel = require("../../profile/profileModel");
const {
  closeRequest,
  sellPosition,
  buyPosition,
  getSingleSymbolPrice,
} = require("../../../helpers/mt5");
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
            await orderModel.updateOrderProductTicketId(
              inserted.id,
              selectedProduct.mt5_position_id
            );
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
    if (
      req.body.status == "sellback" ||
      req.body.status == "deliver" ||
      req.body.status == "collect"
    ) {
      if (req.body.status == "sellback") {
        let symbolLatestPrice = await getSingleSymbolPrice(
          selectedProduct.symbol
        );
        let totalPrice = symbolLatestPrice[0].Bid * req.body.quantity;
        await updateWalletAmount(
          req.params.user_id,
          totalPrice,
          "+",
          "Sell-back%20" +
            selectedProduct.symbol +
            "%20x%20" +
            req.body.quantity
        );
        await orderModel.updateOrderProductLatestPrice(
          selectedProduct.product_id,
          symbolLatestPrice[0].Bid
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
      if (selectedProduct.quantity > req.body.quantity) {
        await sellPosition(
          userMetadata.meta_values,
          selectedProduct.symbol,
          req.body.quantity,
          selectedProduct.mt5_position_id
        );
      } else {
        await closeRequest(
          userMetadata.meta_values,
          selectedProduct.symbol,
          selectedProduct.quantity,
          selectedProduct.mt5_position_id
        );
      }
    } else {
      await buyPosition(
        userMetadata.meta_values,
        selectedProduct.symbol,
        req.body.quantity,
        selectedProduct.price
      );
    }
    return res.status(201).json({ msg: "Order has been updated successfully" });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
