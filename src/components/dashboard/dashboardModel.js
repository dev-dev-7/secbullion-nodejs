const db = require("../../config/connection");
const table = "tbl_products";

const getById = (id) => {
  return db(table).where("id", id).first();
};


module.exports = {
  getById,
};
