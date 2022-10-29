import { getPagination, getPagingData } from "./pagination.util.js";
import mongoose from "mongoose";
import { succeed, failed } from "./api.response.js";
import { MESSAGE_COMMON_ERROR } from "../constants/message.constant.js";

// *********************************************************

const getAll =
  (Model) =>
  async ({ query, page, size }) => {
    try {
      const { limit, offset } = getPagination(page, size);

      const rows = await Model.find().limit(limit).skip(offset).exec();

      const count = await Model.countDocuments();

      return succeed(getPagingData({ rows, count }, page, limit));
    } catch (err) {
      console.error(err);
      return failed(err?.message);
    }
  };

// *********************************************

const getById = (Model) => async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return failed("Invalid ID");
    }
    const result = await Model.findById(id);
    if (!result) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(result);
  } catch (error) {
    console.error(error);
    return failed(error.message);
  }
};

// // *********************************************

const create = (Model) => async (data) => {
  try {
    const result = await Model.create(data);
    return succeed(result);
  } catch (err) {
    console.error(err.message);
    return failed(err.message);
  }
};

// *********************************************

const update = (Model) => async (filter, update) => {
  try {
    const result = await Model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }

    return succeed(result);
  } catch (err) {
    console.error(err.message);
    return failed(err.message);
  }
};

// // *********************************************

const _delete = (Model) => async (id) => {
  try {
    const result = await Model.findByIdAndDelete(id);
    if (!result) {
      return failed(MESSAGE_COMMON_ERROR.NOT_FOUND);
    }
    return succeed(result);
  } catch (err) {
    console.error(err);
    return failed(err.message);
  }
};

const serviceFactory = { create, update, _delete, getById, getAll };

export default serviceFactory;
