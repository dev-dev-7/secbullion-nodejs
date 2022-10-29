import bannerService from "./banner.service.js";
import lodash from "lodash";

import { REQUEST_BANNER_FIELDS } from "./banner.dto.js";
import {
  MESSAGE_COMMON_ERROR,
  MESSAGE_CRUD_SUCCESS,
} from "../../constants/message.constant.js";
import { failed, succeed } from "../../helpers/api.response.js";
import handlerFactory from "../../helpers/handler.factory.js";

// ******************************************************

// exports.create = handlerFactory.create(bannerService);
// exports.getAll = handlerFactory.getAll(bannerService);
// exports.getById = handlerFactory.getById(bannerService);
// exports.update = handlerFactory.update(bannerService);
// exports.delete = handlerFactory.delete(bannerService);

const getAll = async (req, res) => {
  try {
    const { page, size } = req.query;
    const result = await bannerService.getAll({ page, size });
    return res
      .status(200)
      .json(succeed(result.data, MESSAGE_CRUD_SUCCESS.GET_LIST_SUCCESS));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG));
  }
};

const create = async (req, res) => {
  try {
    let banner = lodash.pick(req.body, REQUEST_BANNER_FIELDS);

    banner.user_id = req.user?._id ?? banner.user_id;

    const bannerResult = await bannerService.create(banner);

    if (!bannerResult?.success) {
      return res
        .status(404)
        .json(failed(bannerResult.message ?? MESSAGE_COMMON_ERROR.WRONG));
    }

    return res
      .status(200)
      .json(succeed(bannerResult.data, MESSAGE_CRUD_SUCCESS.CREATE_SUCCESS));
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json(failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG));
  }
};

// ******************************************************
const getById = handlerFactory.getById(bannerService);
const update = handlerFactory.update(bannerService);
const _delete = handlerFactory._delete(bannerService);

const bannerController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default bannerController;
