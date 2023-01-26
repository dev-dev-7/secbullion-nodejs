const db = require("../../config/connection");
const orderTable = "tbl_product_orders";
const orderDetailsTable = "tbl_product_order_details";

const create = async ({
  user_id,
  subtotal,
  total,
  currency,
  txn_token,
  coupon_code,
  discount_price,
}) => {
  return db(orderTable)
    .insert({
      user_id: user_id,
      subtotal: subtotal,
      total: total,
      currency: currency,
      txn_token: txn_token,
      coupon_code: coupon_code,
      discount_price: discount_price,
    })
    .then((id) => getOrderById(id));
};

const getOrderById = (id) => {
  return db(orderTable).where("id", id).first();
};

const getOrderByUserId = (user_id) => {
  return db(orderTable).where("user_id", user_id).first();
};

const getByTaxnId = (txn_token) => {
  return db(orderTable).where("txn_token", txn_token).first();
};

const insertOrderDetails = async (
  user_id,
  order_id,
  {
    product_id,
    quantity,
    unit,
    price,
    currency,
    duration,
    duration_type,
    delivery_id,
    type,
  }
) => {
  return db(orderDetailsTable).insert({
    user_id: user_id,
    order_id: order_id,
    product_id: product_id,
    quantity: quantity,
    unit: unit,
    price: price,
    currency: currency,
    duration: duration ? duration : 0,
    duration_type: duration_type ? duration_type : "",
    delivery_id: delivery_id ? delivery_id : 0,
    status: type,
  });
};

const getByStatus = (user_id, statuses) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .whereIn("status", statuses);
};

const getByUserProduct = (id, user_id, product_id) => {
  return db(orderDetailsTable)
    .where("id", id)
    .andWhere("user_id", user_id)
    .andWhere("product_id", product_id)
    .first();
};

const updateProduct = async (user_id, product_id, { status, delivery_id }) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .update({
      status: status,
      delivery_id: delivery_id,
    });
};

const getUserOrderByType = (user_id, product_id, status) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .andWhere("status", status)
    .first();
};

const deleteUserOrderProduct = (id, user_id) => {
  return db(orderDetailsTable)
    .where("id", id)
    .andWhere("user_id", user_id)
    .del();
};

const updateOrderProductQuantity = async (
  product_order_id,
  user_id,
  product_id,
  quantity
) => {
  return db(orderDetailsTable)
    .where("id", product_order_id)
    .andWhere("user_id", user_id)
    .andWhere("product_id", product_id)
    .update({
      quantity: quantity,
    })
    .then((updated) => getOrderById(product_order_id));
};

const updateOrderProductPrice = async (product_id, price) => {
  return db(orderDetailsTable)
    .where("product_id", product_id)
    .andWhere("status", "!=", "collect")
    .andWhere("status", "!=", "deliver")
    .update({
      price: price,
    });
};

module.exports = {
  create,
  getOrderByUserId,
  getByTaxnId,
  insertOrderDetails,
  getByStatus,
  getByUserProduct,
  updateProduct,
  getUserOrderByType,
  deleteUserOrderProduct,
  updateOrderProductQuantity,
  updateOrderProductPrice,
};
