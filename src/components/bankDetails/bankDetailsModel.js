const db = require("../../config/connection");
const bankTable = "tbl_user_bank_details";

const create = async (data) => {
  return db(bankTable)
    .insert(data)
    .then((user_id) => getBankByUserId(data.user_id));
};

const update = async (id, user_id, data) => {
  return db(bankTable)
    .where("id", id)
    .where("user_id", user_id)
    .update(data)
    .then((updated) => getBankByUserId(user_id));
};

const getBankByUserId = (user_id) => {
  return db(bankTable).where("user_id", user_id);
};

const getBankByIban = (user_id, iban) => {
  return db(bankTable).where("user_id", user_id).andWhere("iban", iban).first();
};

const deleteUserBank = (user_id, id) => {
  return db(bankTable).where("user_id", user_id).andWhere("id", id).del();
};

const getBankById = (id) => {
  return db(bankTable).where("id", id).first();
};

module.exports = {
  create,
  update,
  getBankByIban,
  getBankByUserId,
  deleteUserBank,
  getBankById,
};
