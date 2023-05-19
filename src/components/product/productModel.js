const db = require("../../config/connection");
const table = "tbl_products";
const tableFiles = "tbl_product_files";

const create = async ({
  category_id,
  title,
  description,
  about,
  specification,
  symbol,
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
      symbol: symbol,
      quantity: quantity,
      unit: unit,
    })
    .then((id) => getById(id));
};

const update = async (
  id,
  {
    category_id,
    title,
    description,
    about,
    specification,
    symbol,
    quantity,
    unit,
  }
) => {
  return db(table)
    .where("id", id)
    .update({
      category_id: category_id,
      title: title,
      description: description,
      about: about,
      specification: specification,
      symbol: symbol,
      quantity: quantity,
      unit: unit,
    })
    .then((updated) => deleteByFilesByProduct(id));
};

const remove = async (id) => {
  return db(table)
    .where("id", id)
    .update({ status: 4 })
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

const getBySymbol = (symbol) => {
  return db(table).where("symbol", symbol);
};

const getActiveByCategory = (category_id) => {
  return db(table).where("category_id", category_id).andWhere("status", 1);
};

const getActiveProductsWithFiles = () => {
  return db
    .select(table + ".*", tableFiles + ".file")
    .from(table)
    .leftJoin(tableFiles, table + ".id", tableFiles + ".product_id")
    .where(table + ".status", "!=", 4)
    .groupBy("id");
};

const getProductWithFile = (product_id) => {
  return db(table)
    .leftJoin(db(tableFiles).select("*").as("f"), "f.product_id", table + ".id")
    .where(table + ".id", product_id)
    .first();
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
  return db(tableFiles).where("product_id", product_id).limit(3);
};

const deleteByFilesByProduct = (product_id) => {
  return db(tableFiles)
    .where("product_id", product_id)
    .del()
    .then(() => getById(product_id));
};

const isExistProduct = (symbol) => {
  return db(table).where("symbol", symbol).first();
};

const updateProductPrice = async (id, symbol, ask_price, bid_price) => {
  return db(table)
    .where("id", id)
    .andWhere("symbol", symbol)
    .update({
      last_price: ask_price,
      bid_price: bid_price
    })
    .then((updated) => getById(id));
};

const getFilesByProductId = (product_id) => {
  return db(tableFiles).where("product_id", product_id).limit(10);
};

module.exports = {
  get,
  create,
  update,
  remove,
  getById,
  getByTitle,
  getByCategory,
  getBySymbol,
  getProductWithFile,
  getActiveByCategory,
  insertFiles,
  getByFilesByProduct,
  getActiveProductsWithFiles,
  isExistProduct,
  updateProductPrice,
  getFilesByProductId,
};
