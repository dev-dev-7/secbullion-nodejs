const db = require("../../config/connection");
const usermetaTable = "tbl_user_metadata";
const userhistoryTable = "tbl_user_history";

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

const updateMetaData = async (id, meta_key, meta_values) => {
  return db(usermetaTable)
    .where({ id: id, meta_key: meta_key })
    .update({ meta_values: meta_values })
    .then((updated) => getMetaDataById(id));
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

const getUserMetaDatasKey = (user_id, meta_key) => {
  return db(usermetaTable).where({ user_id: user_id, meta_key: meta_key });
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

const deleteUserMetadata = (id, user_id, meta_key) => {
  return db(usermetaTable)
    .where("id", id)
    .andWhere("user_id", user_id)
    .andWhere("meta_key", meta_key)
    .del();
};

const insertUserHistory = async (user_id, history_key, history_message) => {
  return db(userhistoryTable).insert({
    user_id,
    history_key,
    history_message,
  });
};

const getUserHistoryKey = async (user_id, history_key, time = "") => {
  if (time) {
    return db(userhistoryTable)
      .where({
        user_id: user_id,
        history_key: history_key,
      })
      .where("created_at", ">", time);
  } else {
    return db(userhistoryTable).where({
      user_id: user_id,
      history_key: history_key,
    });
  }
};

module.exports = {
  insertUserMetaData,
  updateUserMetaData,
  updateMetaData,
  getUserMetaData,
  getMetaDataById,
  getUserMetaDataKey,
  getUserMetaDatasKey,
  getUserMetaDataKeyValue,
  getMetaDataKeyValue,
  getUsernameExist,
  deleteUserMetadata,
  insertUserHistory,
  getUserHistoryKey,
};
