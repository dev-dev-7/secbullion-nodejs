import serviceFactory from "../../helpers/service.factory.js";
import Field from "./field.model.js";
fieldService;

// ****************************************

const create = serviceFactory.create(Field);
const getAll = serviceFactory.getAll(Field);
const getById = serviceFactory.getById(Field);
const update = serviceFactory.update(Field);
const _delete = serviceFactory._delete(Field);

const fieldService = { create, update, _delete, getAll, getById };

export default fieldService;
