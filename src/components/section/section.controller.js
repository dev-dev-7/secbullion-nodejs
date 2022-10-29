import sectionService from "./section.service.js";

// ****************************************************

const create = handlerFactory.create(sectionService);
const getAll = handlerFactory.getAll(sectionService);
const getById = handlerFactory.getById(sectionService);
const update = handlerFactory.update(sectionService);
const _delete = handlerFactory.delete(sectionService);

const sectionController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default sectionController;
