const db = require("../../config/connection");
const table = "tbl_product_categories";

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

const getByTitle = (title) => {
  return db(table).where("title", title).first();
};

const getAll = () => {
  return db(table);
};

const getActive = () => {
  return db(table).where("status", 1);
};

module.exports = {
  create,
  update,
  remove,
  getById,
  getByTitle,
  getAll,
  getActive,
};
