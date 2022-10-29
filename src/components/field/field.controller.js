import fieldService from "./field.service.js";

// ****************************************************

const create = handlerFactory.create(fieldService);
const getAll = handlerFactory.getAll(fieldService);
const getById = handlerFactory.getById(fieldService);
const update = handlerFactory.update(fieldService);
const _delete = handlerFactory.delete(fieldService);

const fieldController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default fieldController;
