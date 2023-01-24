const db = require("../../config/connection");
const table = "tbl_products";
const tableFiles = "tbl_product_files";

const create = async ({
  category_id,
  title,
  description,
  about,
  specification,
  quantity,
  unit,
}) => {
  return db(table)
    .insert({
      category_id: category_id,
      title: title,
      description: description,
      about: about,
      specification: specification,
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

const getActiveByCategory = (category_id) => {
  return db(table).where("category_id", category_id).andWhere("status", 1);
};

const getActiveProducts = () => {
  return db(table).where("status", 1).limit(8);
};

const get = () => {
  return db(table);
};

const insertFiles = async (product_id, file) => {
  return db(tableFiles)
    .insert({
      product_id: product_id,
      file: file,
    })
    .then((id) => getById(id));
};

const getByFilesByProduct = (product_id) => {
  return db(tableFiles).where("product_id", product_id);
};

const isExistProduct = (title, quantity, unit) => {
  return db(table)
    .where("title", title)
    .andWhere("quantity", quantity)
    .andWhere("unit", unit)
    .first();
};

module.exports = {
  create,
  update,
  remove,
  getById,
  getByTitle,
  getByCategory,
  getActiveByCategory,
  get,
  insertFiles,
  getByFilesByProduct,
  getActiveProducts,
  isExistProduct,
};
