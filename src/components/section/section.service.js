import serviceFactory from "../../helpers/service.factory.js";
import Section from "./section.model.js";

// ****************************************

const create = serviceFactory.create(Section);
const getAll = serviceFactory.getAll(Section);
const getById = serviceFactory.getById(Section);
const update = serviceFactory.update(Section);
const _delete = serviceFactory._delete(Section);

const sectionService = { create, update, _delete, getAll, getById };

export default sectionService;
