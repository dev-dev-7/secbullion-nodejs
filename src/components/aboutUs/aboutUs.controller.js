import handlerFactory from "../../helpers/handler.factory.js";
import { RESPONSE_ABOUTUS_FIELDS } from "./aboutUs.dto.js";
import aboutUsService from "./aboutUs.service.js";

// ****************************************************

const create = handlerFactory.create(aboutUsService);
const getAll = handlerFactory.getAll(aboutUsService);
const getById = handlerFactory.getById(aboutUsService);
const update = handlerFactory.update(aboutUsService);
const _delete = handlerFactory._delete(aboutUsService);

const aboutUsController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default aboutUsController;
