import serviceFactory from "../../helpers/service.factory.js";
import AboutUs from "./aboutUs.model.js";

// ****************************************

const create = serviceFactory.create(AboutUs);
const getAll = serviceFactory.getAll(AboutUs);
const getById = serviceFactory.getById(AboutUs);
const update = serviceFactory.update(AboutUs);
const _delete = serviceFactory._delete(AboutUs);

const aboutUsService = { create, update, _delete, getAll, getById };

export default aboutUsService;
