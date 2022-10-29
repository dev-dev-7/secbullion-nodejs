import handlerFactory from "../../helpers/handler.factory.js";
import { RESPONSE_DETAIL_FIELDS } from "./detail.dto.js";
import detailService from "./detail.service.js";

// ****************************************************

const create = handlerFactory.create(detailService);
const getAll = handlerFactory.getAll(detailService);
const getById = handlerFactory.getById(detailService);
const update = handlerFactory.update(detailService);
const _delete = handlerFactory._delete(detailService);

const detailController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default detailController;
