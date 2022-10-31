const DB = require("../config/connection");
const Hash = require("../helpers/Hash");
const table = "users";

/**
 * Get user by email () password ()
 * @param {string} email is email of user
 * @param {string} password is password of user
 */
const getUserByEmailPassword = (email, password) => {
  return DB(table).where("email", email).andWhere("password", password);
};

const registerUser = async ({ email, mobile, password }) => {
  return DB(table)
    .insert({
      email,
      mobile,
      password: Hash.make(password),
    })
    .then((id) => getUserById(id));
};

/**
 * Get all users
 */
const getAllUsers = async (data) => {
  return DB(table).then((users) => users);
};

/**
 * Get user by email ()
 * @param {string} email is email of user
 */
const getUserByEmail = (email) => {
  return DB(table).where("email", email).first();
};

/**
 * Get user by User ID
 * @param {number} id is searched user id
 */
const getUserById = (id) => {
  return DB(table).where("id", id).first();
};

/**
 * Get user
 * @param {number} id is searched user id
 */
const getUser = (data) => {
  return DB(table).where(data).first();
};

/**
 * Deleteing user by id
 * @param {number} id is deleted user id
 */
const deleteUserById = (id) => {
  return DB(table).where("id", id).del();
};

const updateUserById = async (id, data) => {
  return DB(table)
    .where("id", id)
    .update(data)
    .then((updated) => getUserById(id));
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  deleteUserById,
  updateUserById,
  getUser,
};
