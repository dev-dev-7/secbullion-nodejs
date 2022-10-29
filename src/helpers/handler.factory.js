import {
  MESSAGE_COMMON_ERROR,
  MESSAGE_CRUD_SUCCESS,
} from "../constants/message.constant.js";
import { mongoose } from "mongoose";
import { failed, succeed } from "./api.response.js";
import lodash from "lodash";

// *********************************************************

const create =
  (ModelService, RequestDTO = null) =>
  async (req, res) => {
    try {
      let item = RequestDTO ? lodash.pick(req.body, RequestDTO) : req.body;

      item.user_id = req.user?._id;

      const result = await ModelService.create(item);
      if (!result.success)
        return res.status(400).json(failed(MESSAGE_COMMON_ERROR.WRONG));

      return res
        .status(200)
        .json(succeed(result.data, MESSAGE_CRUD_SUCCESS.CREATE_SUCCESS));
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG));
    }
  };

// *********************************************************

const getById = (ModelService) => async (req, res) => {
  try {
    const id = req.params?.id;
    const result = await ModelService.getById(id);

    if (!result.success) {
      return res
        .status(404)
        .json(failed(result.message ?? MESSAGE_COMMON_ERROR.NOT_FOUND));
    }
    return res
      .status(200)
      .json(succeed(result.data, MESSAGE_CRUD_SUCCESS.GET_SUCCESS));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG));
  }
};

// *********************************************************
const getAll = (ModelService) => async (req, res) => {
  try {
    const { page, size } = req.query;
    const result = await ModelService.getAll({ page, size });

    res
      .status(200)
      .json(succeed(result.data, MESSAGE_CRUD_SUCCESS.GET_LIST_SUCCESS));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG));
  }
};

// *********************************************************

const update = (ModelService) => async (req, res) => {
  const id = req.params?.id;
  const data = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(failed("Invalid ID"));
    }
    const filter = { _id: id };
    const update = { ...data };
    const result = await ModelService.update(filter, update);

    if (!result.success) {
      return res.status(404).json(failed(MESSAGE_COMMON_ERROR.NOT_FOUND));
    }

    if (!result) return res.status(404).json(failed("item not found"));

    return res.status(200).json(succeed(MESSAGE_CRUD_SUCCESS.UPDATE_SUCCESS));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failed(error.message));
  }
};

// *********************************************************

const _delete = (ModelService) => async (req, res) => {
  const id = req.params?.id;
  try {
    const result = await ModelService._delete(id);

    if (!result.success)
      return res
        .status(404)
        .json(failed("Could not delete item with id= " + id, result.message));

    return res
      .status(200)
      .json(succeed(undefined, MESSAGE_CRUD_SUCCESS.DELETE_SUCCESS));
  } catch (error) {
    console.error(error);
    return res.status(500).json(failed(error.message));
  }
};

// *********************************************************

const handlerFactory = { create, getAll, getById, update, _delete };
export default handlerFactory;
