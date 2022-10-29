import pageController from "./page.service.js";

// ****************************************************

const create = handlerFactory.create(pageController);
const getAll = handlerFactory.getAll(pageController);
const getById = handlerFactory.getById(pageController);
const update = handlerFactory.update(pageController);
const _delete = handlerFactory.delete(pageController);

const pageController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default pageController;
