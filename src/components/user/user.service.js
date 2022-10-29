import {
  MESSAGE_COMMON_ERROR,
  MESSAGE_CRUD_SUCCESS,
  MESSAGE_USER_ERROR,
} from "../../constants/message.constant.js";
import serviceFactory from "../../helpers/service.factory.js";
import { failed, succeed } from "../../helpers/api.response.js";
import User from "./user.model.js";

// ***********************************************************************

// ****************************************

// const create = serviceFactory.create(Category);
const getAll = serviceFactory.getAll(User);
// const getById = serviceFactory.getById(Category);
const update = serviceFactory.update(User);
const _delete = serviceFactory._delete(User);

const create = async (user) => {
  try {
    const createdUser = await User.create(user);

    if (!createdUser) {
      return failed(MESSAGE_COMMON_ERROR.WRONG);
    }
    return succeed(createdUser, MESSAGE_CRUD_SUCCESS.CREATE_SUCCESS);
  } catch (error) {
    console.error(error);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};

// *********************************************userService

const getByEmailWithPassword = async (email) => {
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return failed(MESSAGE_USER_ERROR.NOT_FOUND);
    }
    return succeed(user);
  } catch (error) {
    console.error(error);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};

// *********************************************

const getByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return failed(MESSAGE_USER_ERROR.NOT_FOUND);
    }
    return succeed(user);
  } catch (error) {
    console.error(error);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};

// *********************************************

const getById = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      return failed(MESSAGE_USER_ERROR.NOT_FOUND);
    }
    return succeed(user);
  } catch (error) {
    console.error(error);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};

// *********************************************

const userService = {
  create,
  update,
  _delete,
  getAll,
  getByEmailWithPassword,
  getByEmail,
  getById,
};

export default userService;
