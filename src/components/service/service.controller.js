import handlerFactory from "../../helpers/handler.factory.js";
import serviceService from "./service.service.js";

// ****************************************************

const create = handlerFactory.create(serviceService);
const getAll = handlerFactory.getAll(serviceService);
const getById = handlerFactory.getById(serviceService);
const update = handlerFactory.update(serviceService);
const _delete = handlerFactory._delete(serviceService);

const serviceController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default serviceController;
