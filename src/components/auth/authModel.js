const db = require("../../config/connection");
const Hash = require("../../helpers/hash");
const userTable = "tbl_users";

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

const getUsers = () => {
  return db(userTable);
};

const getUserById = (user_id) => {
  return db(userTable).where("user_id", user_id).first();
};

const getUserByPassword = (password) => {
  return db(userTable).where("password", password).first();
};

const deleteUserById = (user_id) => {
  return db(userTable).where("user_id", user_id).del();
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  getUserById,
  getUserByPassword,
  deleteUserById,
};
