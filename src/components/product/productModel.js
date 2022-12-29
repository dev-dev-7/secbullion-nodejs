const db = require("../../config/connection");
const table = "products";

const create = async ({ category_id, title, description, quantity, unit }) => {
  return db(table)
    .insert({
      category_id: category_id,
      title: title,
      description: description,
      quantity: quantity,
      unit: unit,
    })
    .then((id) => getById(id));
};

const update = async (
  id,
  { category_id, title, description, price, quantity, unit }
) => {
  return db(table)
    .where("id", id)
    .update({
      category_id: category_id,
      title: title,
      description: description,
      quantity: quantity,
      unit: unit,
    })
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

const getByCategory = (category_id) => {
  return db(table).where("category_id", category_id);
};

const get = () => {
  return db(table);
};

module.exports = {
  create,
  update,
  remove,
  getById,
  getByTitle,
  getByCategory,
  get,
};
