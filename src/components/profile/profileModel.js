const db = require("../../config/connection");
const usermetaTable = "tbl_user_metadata";

const insertUserMetaData = async (user_id, meta_key, meta_values) => {
  return db(usermetaTable)
    .insert({
      user_id: user_id,
      meta_key: meta_key,
      meta_values: meta_values,
    })
    .then((id) => getMetaDataById(id));
};

const updateUserMetaData = async (user_id, meta_key, meta_values) => {
  return db(usermetaTable)
    .where({ user_id: user_id, meta_key: meta_key })
    .update({ meta_values: meta_values })
    .then((updated) => getUserMetaData(user_id));
};

const getUserMetaData = (user_id) => {
  return db(usermetaTable)
    .where("user_id", user_id)
    .andWhere("meta_key", "!=", "otp_code");
};

const getMetaDataById = (id) => {
  return db(usermetaTable).where("id", id).first();
};

const getUserMetaDataKey = (user_id, meta_key) => {
  return db(usermetaTable)
    .where({ user_id: user_id, meta_key: meta_key })
    .first();
};

const getUserMetaDataKeyValue = (user_id, meta_key, meta_values) => {
  return db(usermetaTable)
    .where({ user_id: user_id, meta_key: meta_key, meta_values: meta_values })
    .first();
};

const getMetaDataKeyValue = (meta_key, meta_values) => {
  return db(usermetaTable)
    .where({ meta_key: meta_key, meta_values: meta_values })
    .first();
};

const getUsernameExist = (user_id, meta_key, meta_values) => {
  return db(usermetaTable)
    .where({ meta_key: meta_key, meta_values: meta_values })
    .andWhere("user_id", "!=", user_id)
    .first();
};

module.exports = {
  insertUserMetaData,
  updateUserMetaData,
  getUserMetaData,
  getUserMetaDataKey,
  getUserMetaDataKeyValue,
  getMetaDataKeyValue,
  getUsernameExist,
};
