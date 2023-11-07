const db = require("../../config/connection");
const table = "tbl_app_metadata";
const tableUserMetadataTable = "tbl_user_metadata";
const tableCurrenciesTable = "tbl_currencies";

const create = async ({ meta_key, meta_values }) => {
  return db(table)
    .insert({ meta_key: meta_key, meta_values: meta_values })
    .then((id) => getById(id));
};

const update = async (id, { meta_key, meta_values, status }) => {
  return db(table)
    .where("id", id)
    .update({ meta_key: meta_key, meta_values: meta_values, status: status })
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

const getByMetaKey = (meta_key) => {
  return db(table).where("meta_key", meta_key).first();
};

const getByUserMetaKey = (meta_key) => {
  return db(tableUserMetadataTable).where("meta_key", meta_key);
};

const getAll = () => {
  return db(table);
};

const getActive = () => {
  return db(table).where("status", 1);
};

const getAllCurrencies = () => {
  return db(tableCurrenciesTable);
};

module.exports = {
  create,
  update,
  remove,
  getById,
  getByMetaKey,
  getByUserMetaKey,
  getAll,
  getActive,
  getAllCurrencies
};
