const db = require("../../config/connection");
const cartTable = "tbl_user_carts";
const couponTable = "tbl_coupons";

const create = async (
  user_id,
  product_id,
  { type, quantity, unit, duration, duration_type }
) => {
  return db(cartTable)
    .insert({
      user_id: user_id,
      product_id: product_id,
      type: type,
      quantity: quantity,
      unit: unit,
      duration: duration ? duration : 0,
      duration_type: duration_type,
    })
    .then((user_id) => getCartByUserId(user_id));
};

const update = async (user_id, product_id, type, data) => {
  return db(cartTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .andWhere("type", type)
    .update(data)
    .then((updated) => getCartByUserId(user_id));
};

const getCartByUserId = (user_id) => {
  return db(cartTable).where("user_id", user_id);
};

const getUserCartProductByType = (user_id, product_id, type) => {
  return db(cartTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .andWhere("type", type)
    .first();
};

const deleteUserCart = (user_id, product_id, type) => {
  return db(cartTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .andWhere("type", type)
    .del();
};

const getCoupon = (coupon_code) => {
  return db(couponTable).where("coupon_code", coupon_code).first();
};

module.exports = {
  create,
  update,
  getCartByUserId,
  getUserCartProductByType,
  deleteUserCart,
  getCoupon,
};
