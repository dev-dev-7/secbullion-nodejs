import handlerFactory from "../../helpers/handler.factory.js";
import { RESPONSE_CATEGORY_FIELDS } from "./category.dto.js";
import categoryService from "./category.service.js";

// ****************************************************

const create = handlerFactory.create(categoryService);
const getAll = handlerFactory.getAll(categoryService);
const getById = handlerFactory.getById(categoryService);
const update = handlerFactory.update(categoryService);
const _delete = handlerFactory._delete(categoryService);

const categoryController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default categoryController;
