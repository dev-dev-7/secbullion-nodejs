const db = require("../../config/connection");
const cartTable = "tbl_user_carts";

const create = async ({
  user_id,
  product_id,
  type,
  quantity,
  unit,
  duration,
  duration_type,
}) => {
  return db(cartTable)
    .insert({
      user_id: user_id,
      product_id: product_id,
      type: type,
      quantity: quantity,
      unit: unit,
      duration: duration,
      duration_type: duration_type,
    })
    .then((user_id) => getCartByUserId(user_id));
};

const update = async (user_id, product_id, data) => {
  return db(cartTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .update(data)
    .then((updated) => getCartByUserId(user_id));
};

const getCartByUserId = (user_id) => {
  return db(cartTable).where("user_id", user_id);
};

const getUserCartByProductId = (user_id, product_id) => {
  return db(cartTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id);
};

const deleteUserCart = (user_id, product_id) => {
  return db(cartTable)
    .where("user_id", user_id)
    .andWhere("product_id", product_id)
    .del();
};

module.exports = {
  create,
  update,
  getCartByUserId,
  getUserCartByProductId,
  deleteUserCart,
};
