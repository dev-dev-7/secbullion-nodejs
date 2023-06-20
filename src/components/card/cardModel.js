const db = require("../../config/connection");
const table = "tbl_payments";

const create = async ({ title }) => {
  return db(table)
    .insert({ title: title })
    .then((id) => getById(id));
};

const update = async (id, { title, status }) => {
  return db(table)
    .where("id", id)
    .update({ title: title, status: status })
    .then((updated) => getById(id));
};

const remove = async (id) => {
  return db(table)
    .del()
    .where("id", id)
    .then((updated) => getById(id));
};

const getById = (id) => {
  return db(table).where("id", id).first();
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
};
