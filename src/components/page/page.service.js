import serviceFactory from "../../helpers/service.factory.js";
import Page from "./page.model.js";

// ****************************************

const create = serviceFactory.create(Page);
const getAll = serviceFactory.getAll(Page);
const getById = serviceFactory.getById(Page);
const update = serviceFactory.update(Page);
const _delete = serviceFactory._delete(Page);

const pageService = { create, update, _delete, getAll, getById };

export default pageService;
