import serviceFactory from "../../helpers/service.factory.js";
import Detail from "./detail.model.js";

// ****************************************

const create = serviceFactory.create(Detail);
const getAll = serviceFactory.getAll(Detail);
const getById = serviceFactory.getById(Detail);
const update = serviceFactory.update(Detail);
const _delete = serviceFactory._delete(Detail);

const detailService = { create, update, _delete, getAll, getById };

export default detailService;
