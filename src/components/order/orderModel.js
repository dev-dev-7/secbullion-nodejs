const db = require("../../config/connection");
const orderTable = "tbl_product_orders";

const create = async ({
  user_id,
  product_id,
  quantity,
  unit,
  price,
  currency,
  delivery_id,
  txn_token,
}) => {
  return db(orderTable)
    .insert({
      user_id: user_id,
      product_id: product_id,
      quantity: quantity,
      unit: unit,
      price: price,
      currency: currency,
      delivery_id: delivery_id,
      txn_token: txn_token,
    })
    .then((id) => getOrderById(id));
};

const getOrderById = (id) => {
  return db(orderTable).where("id", id).first();
};

const getByTaxnId = (txn_token) => {
  return db(orderTable).where("txn_token", txn_token).first();
};

module.exports = {
  create,
  getByTaxnId,
};
