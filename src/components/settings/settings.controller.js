import settingsService from "./settings.service.js";
import lodash from "lodash";

// import { REQUEST_BANNER_FIELDS } from "./settings.dto.js";
// import {
//   MESSAGE_COMMON_ERROR,
//   MESSAGE_CRUD_SUCCESS,
// } from "../../constants/message.constant.js";
// import { failed, succeed } from "../../helpers/api.response.js";
import handlerFactory from "../../helpers/handler.factory.js";
import { REQUEST_SETTINGS_FIELDS } from "./settings.dto.js";

// ******************************************************

// ******************************************************
const create = handlerFactory.create(settingsService);
// const getAll = handlerFactory.getAll(settingsService);
const getById = handlerFactory.getById(settingsService);
const update = handlerFactory.update(settingsService);
const _delete = handlerFactory._delete(settingsService);

const settingsController = {
  // getAll,
  create,
  getById,
  update,
  _delete,
};

export default settingsController;
