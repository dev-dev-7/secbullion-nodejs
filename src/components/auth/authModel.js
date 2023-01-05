const db = require("../../config/connection");
const Hash = require("../../helpers/hash");
const userTable = "tbl_users";
const usermetaTable = "tbl_user_metadata";
const userhistoryTable = "tbl_user_history";

const createUser = async ({ password }) => {
  return db(userTable)
    .insert({ password: Hash.make(password) })
    .then((user_id) => getUserById(user_id));
};

const updateUser = async (user_id, data) => {
  return db(userTable)
    .where("user_id", user_id)
    .update(data)
    .then((updated) => getUserById(user_id));
};

const getUserById = (user_id) => {
  return db(userTable).where("user_id", user_id).first();
};

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
    .then((updated) => getMetaDataById(user_id));
};

const getMetaDataById = (id) => {
  return db(usermetaTable).where("id", id).first();
};

const getUserMetaData = (user_id) => {
  return db(usermetaTable)
    .where("user_id", user_id)
    .andWhere("meta_key", "!=", "otp_code");
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

const deleteUserById = (user_id) => {
  return db(userTable).where("user_id", user_id).del();
};

const insertUserHistory = async (user_id, history_key, history_message) => {
  return db(userhistoryTable)
    .insert({
      user_id,
      history_key,
      history_message,
    })
    .then((id) => getUserById(id));
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
  createUser,
  updateUser,
  getUserById,
  insertUserMetaData,
  updateUserMetaData,
  getUserMetaData,
  getUserMetaDataKey,
  getUserMetaDataKeyValue,
  getMetaDataKeyValue,
  deleteUserById,
  insertUserHistory,
  getUserHistoryKey,
};
