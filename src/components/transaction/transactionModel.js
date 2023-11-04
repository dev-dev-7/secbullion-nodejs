const db = require("../../config/connection");
const bankTable = "tbl_bank_transaction";

const create = async (data) => {
  return db(bankTable)
    .insert(data)
    .then((user_id) => getTransactionByUserId(data.user_id));
};

const updateTransaction = async (id, data) => {
  return db(bankTable)
    .where("id", id)
    .update(data)
    .then((updated) => getTransactionById(id));
};

const getAllTransactionsByType = (type) => {
  return db(bankTable).where("type", type).limit(100).orderBy("id", "desc");
};

const getTransactionById = (id) => {
  return db(bankTable)
    .where("id", id)
    .first();
};

const getTransactionByReference = (user_id, reference_number) => {
  return db(bankTable)
    .where("user_id", user_id)
    .andWhere("reference_number", reference_number)
    .first();
};

const getTransactionByUserId = (user_id) => {
  return db(bankTable).where("user_id", user_id).orderBy("id", "desc");
};

module.exports = {
  create,
  updateTransaction,
  getAllTransactionsByType,
  getTransactionById,
  getTransactionByReference,
  getTransactionByUserId,
};
