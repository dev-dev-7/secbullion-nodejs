const db = require("../../config/connection");
const productTable = "tbl_products";
const orderTable = "tbl_product_orders";
const orderDetailsTable = "tbl_product_order_details";
const orderActivityTable = "tbl_product_order_activity";

const create = async ({
  user_id,
  subtotal,
  total,
  currency,
  txn_token,
  coupon_code,
  discount_price,
  delivery_fee,
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
      delivery_fee: delivery_fee,
    })
    .then((id) => getOrderById(id));
};

const updateOrderStatus = async (id, status, user_id) => {
  return db(orderTable).where("id", id).update({
    status: status,
    action_taken_by: user_id,
  });
};

const updateOrderAmount = async (id, amount, discount) => {
  return db(orderTable)
    .where("id", id)
    .update({
      subtotal: amount,
      total: amount - discount,
    });
};

const getAllOrders = () => {
  return db(orderTable).orderBy("id", "DESC");
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

const getOrderDetailsById = (id) => {
  return db(orderDetailsTable).where("id", id).first();
};

const insertOrderDetails = async (
  user_id,
  order_id,
  {
    product_id,
    quantity,
    unit,
    symbol,
    order_price,
    price,
    currency,
    duration,
    duration_type,
    delivery_id,
    type,
    position_id,
  }
) => {
  return db(orderDetailsTable)
    .insert({
      user_id: user_id,
      order_id: order_id,
      product_id: product_id,
      quantity: quantity,
      unit: unit,
      symbol: symbol,
      order_price: order_price,
      price: price,
      currency: currency,
      duration: duration ? duration : 0,
      duration_type: duration_type ? duration_type : "",
      delivery_id: delivery_id ? delivery_id : "",
      mt5_position_id: position_id ? position_id : 0,
      status: type,
    })
    .then((id) => getOrderDetailsById(id));
};

const getAllStakes = () => {
  return db(orderDetailsTable).where("status", "stake");
};

const getByStatus = (user_id, statuses) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .whereIn("status", statuses);
};

const isExistOrderProduct = (id, user_id, product_id) => {
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

const getUserOrderByType = (user_id, order_id, product_id, status) => {
  return db(orderDetailsTable)
    .where("user_id", user_id)
    .andWhere("order_id", order_id)
    .andWhere("product_id", product_id)
    .andWhere("status", status)
    .andWhere("status", "!=", "sellback")
    .first();
};

const getDetailsByOrderId = (order_id) => {
  return db(orderDetailsTable + " as d")
    .select(
      "d.*",
      "p.*",
      "d.quantity as quantity",
      "d.status as status",
      "d.id as id",
      "d.price as price"
    )
    .where("d.order_id", order_id)
    .leftJoin(productTable + " as p", "p.id", "d.product_id");
};

const deleteUserOrderProduct = (id, user_id) => {
  return db(orderDetailsTable)
    .where("id", id)
    .andWhere("user_id", user_id)
    .del();
};

const deleteOrder = (id) => {
  return db(orderTable).where("id", id).del();
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
    .andWhere("status", "!=", "sellback")
    .update({
      price: price,
    });
};

const updateOrderProductLatestPrice = async (product_id, price) => {
  return db(orderDetailsTable).where("product_id", product_id).update({
    price: price,
  });
};

const updateStakeSwapValue = async (id, swap = "0", commission = "0") => {
  return db(orderDetailsTable)
    .where("id", id)
    .andWhere("status", "stake")
    .update({
      swap: swap,
      commission: commission,
    });
};

const updateOrderProductStatus = async (id, status) => {
  return db(orderDetailsTable).where("id", id).update({
    status: status,
  });
};
const updateOrderProductTicketId = async (id, position_id, order_price) => {
  return db(orderDetailsTable).where("id", id).update({
    mt5_position_id: position_id,
    order_price: order_price,
  });
};

const updateOrderProduct = async (
  id,
  {
    quantity,
    unit,
    order_price,
    price,
    duration,
    duration_type,
    delivery_id,
    status,
    position_id,
  }
) => {
  return db(orderDetailsTable)
    .where("id", id)
    .update({
      quantity: quantity,
      unit: unit,
      price: price,
      order_price: order_price,
      duration: duration ? duration : 0,
      duration_type: duration_type ? duration_type : "",
      delivery_id: delivery_id ? delivery_id : "",
      mt5_position_id: position_id ? position_id : 0,
      status: status,
    })
    .then(() => getOrderDetailsById(id));
};

const getSumOfUserStack = async (user_id, type) => {
  return db
    .select(db.raw("SUM(price * quantity) as price"))
    .from(orderDetailsTable)
    .where("user_id", user_id)
    .andWhere("status", type)
    .first();
};

const insertOrderActivity = async (user_id, order_product_id, data) => {
  return db(orderActivityTable).insert({
    user_id: user_id,
    order_product_id: order_product_id,
    data: data,
  });
};

const getActivity = (order_product_id) => {
  return db(orderActivityTable)
    .where("order_product_id", order_product_id)
    .limit(40)
    .orderBy("id", "DESC");
};

module.exports = {
  create,
  updateOrderStatus,
  getOrderById,
  getOrderByUserId,
  getAllOrders,
  getAllStakes,
  getByTaxnId,
  insertOrderDetails,
  getByStatus,
  isExistOrderProduct,
  updateProduct,
  getUserOrderByType,
  getDetailsByOrderId,
  deleteUserOrderProduct,
  updateOrderProduct,
  updateOrderProductQuantity,
  updateOrderProductPrice,
  updateOrderProductLatestPrice,
  updateStakeSwapValue,
  updateOrderProductStatus,
  getSumOfUserStack,
  updateOrderProductTicketId,
  deleteOrder,
  updateOrderAmount,
  insertOrderActivity,
  getActivity,
};
