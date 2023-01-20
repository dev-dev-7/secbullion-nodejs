const db = require("../../config/connection");
const bankTable = "tbl_bank_transaction";

const create = async (data) => {
  return db(bankTable)
    .insert(data)
    .then((user_id) => getTransactionByUserId(data.user_id));
};

const getTransactionByRefrence = (user_id, reference_number) => {
  return db(bankTable)
    .where("user_id", user_id)
    .andWhere("reference_number", reference_number)
    .first();
};

const getTransactionByUserId = (user_id) => {
  return db(bankTable).where("user_id", user_id);
};

module.exports = {
  create,
  getTransactionByRefrence,
  getTransactionByUserId,
};
