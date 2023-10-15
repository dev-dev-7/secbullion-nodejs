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
  let user = await authorization(req, res);
  await orderModel.insertOrderActivity(
    user.user_id,
    req.body.order_product_id,
    req.body
  );
  const userMetadata = await profileModel.getUserMetaDataKey(
    req.params.user_id,
    "mt5_account_no"
  );
  req.body.currency = process.env.DEFAULT_CURRENCY;
  let status = req.body.status;
  let selectedProduct = await orderModel.isExistOrderProduct(
    req.body.order_product_id,
    req.params.user_id,
    req.body.product_id
  );
  if (selectedProduct) {
    // MT5 Command Execution start
    let position;
    if (status == "sellback" || status == "collect" || status == "deliver") {
      position = await sellPosition(
        userMetadata.meta_values,
        selectedProduct.symbol,
        req.body.quantity,
        selectedProduct.mt5_position_id
      );
      if (status == "sellback") {
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
    } else {
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
    // DB Execution start
    if (
      selectedProduct.status != status &&
      req.body.quantity <= selectedProduct.quantity
    ) {
      let orderPrice = position?.PriceOrder ? position?.PriceOrder : 0;
      let sellPrice = position?.ResultDealerBid ? position?.ResultDealerBid : 0;
      req.body.type = status;
      req.body.order_price = status == "sellback" ? sellPrice : orderPrice;
      req.body.position_id = position?.Order;
      if (req.body.quantity < selectedProduct.quantity) {
        // insert new item
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
    return res.status(201).json({
      msg: "Order has been updated successfully",
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.activity = async (req, res) => {
  if (req.params.order_product_id) {
    let activities = await orderModel.getActivity(req.params.order_product_id);
    if (activities?.length) {
      for (var i = 0; i < activities?.length; i++) {
        activities[i].data = JSON.parse(activities[i].data)
        activities[i].user = await profileModel.getUserMetaData(
          activities[i]?.user_id
        );
      }
    }
    return res.status(201).json({ data: activities });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
