import serviceFactory from "../../helpers/service.factory.js";
import Category from "./category.model.js";

// ****************************************

const create = serviceFactory.create(Category);
const getAll = serviceFactory.getAll(Category);
const getById = serviceFactory.getById(Category);
const update = serviceFactory.update(Category);
const _delete = serviceFactory._delete(Category);

const categoryService = { create, update, _delete, getAll, getById };

export default categoryService;
