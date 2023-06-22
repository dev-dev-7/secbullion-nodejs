const db = require("../../config/connection");
const table = "tbl_user_cards";

const create = async ({ user_id, method, type, token, last_digit, expiry_date }) => {
  return db(table)
    .insert({
      user_id: user_id,
      method: method,
      type: type,
      token: token,
      last_digit: last_digit,
      expiry_date: expiry_date
    })
    .then((id) => getById(id));
};

const getById = (id) => {
  return db(table).where("id", id).first();
};

const isExistCard = ({ user_id, type, last_digit }) => {
  return db(table)
    .where("user_id", user_id)
    .andWhere("type", type)
    .andWhere("last_digit", last_digit)
    .first();
};

const update = async (id, { method, type, token, last_digit }) => {
  return db(table)
    .where("id", id)
    .update({
      method: method,
      type: type,
      token: token,
      last_digit: last_digit,
    })
    .then((updated) => getById(id));
};

const remove = async (id) => {
  return db(table)
    .del()
    .where("id", id)
    .then(() => getById(id));
};

const getAll = (user_id) => {
  return db(table).where("user_id", user_id).andWhere("status", 1);
};

module.exports = {
  create,
  update,
  remove,
  getById,
  getAll,
  isExistCard,
};
