import serviceFactory from "../../helpers/service.factory.js";
import Service from "./service.model.js";

// ****************************************

const create = serviceFactory.create(Service);
const getAll = serviceFactory.getAll(Service);
const getById = serviceFactory.getById(Service);
const update = serviceFactory.update(Service);
const _delete = serviceFactory._delete(Service);

const serviceService = { create, update, _delete, getAll, getById };

export default serviceService;
