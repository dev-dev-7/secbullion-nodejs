const db = require("../../config/connection");
const productTable = "tbl_products";
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

const updateOrderStatus = async (id, status) => {
  return db(orderTable)
    .where("id", id)
    .update({
      status: status
    });
};

const getAllOrders = (page = "", status = "", order_id = "") => {
  if (status && order_id) {
    return db(orderTable).where("status", status).andWhere("id", order_id);
  } else if (status) {
    return db(orderTable).where("status", status);
  } else if (order_id) {
    return db(orderTable).where("order_id", order_id);
  } else {
    return db(orderTable);
  }
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
    status,
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
    status: status,
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

const updateProduct = async (user_id, product_id, data) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .update(data);
};

const getUserOrderByType = (user_id, product_id, status) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .andWhere("status", status)
    .first();
};

const getDetailsByOrderId = (order_id) => {
  return db(orderDetailsTable).leftJoin(
    db(productTable)
      .select('*').as('p'), 
    'p.id',
    orderDetailsTable+'.product_id'
  ).where(orderDetailsTable+".order_id", order_id);
};

const deleteUserOrderProduct = (id, user_id) => {
  return db(orderDetailsTable)
    .where("id", id)
    .andWhere("user_id", user_id)
    .del();
};

const updateOrderProductQuantity = async (id, quantity) => {
  return db(orderDetailsTable).where("id", id).update({
      quantity: quantity,
    });
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

const updateOrderProductStatus = async (id, status) => {
  return db(orderDetailsTable).where("id", id).update({
    status: status,
  });
};

const updateOrderProduct = async (id, {
  quantity,
  unit,
  price,
  duration,
  duration_type,
  delivery_id,
  status,
}) => {
  return db(orderDetailsTable).where("id", id).update({
    quantity: quantity,
    unit: unit,
    price: price,
    duration: duration ? duration : 0,
    duration_type: duration_type ? duration_type : "",
    delivery_id: delivery_id ? delivery_id : 0,
    status: status
  });
};

module.exports = {
  create,
  updateOrderStatus,
  getOrderById,
  getOrderByUserId,
  getAllOrders,
  getByTaxnId,
  insertOrderDetails,
  getByStatus,
  getByUserProduct,
  updateProduct,
  getUserOrderByType,
  getDetailsByOrderId,
  deleteUserOrderProduct,
  updateOrderProduct,
  updateOrderProductQuantity,
  updateOrderProductPrice,
  updateOrderProductStatus,
};
