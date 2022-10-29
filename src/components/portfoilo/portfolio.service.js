import serviceFactory from "../../helpers/service.factory.js";
import Portfolio from "./portfolio.model.js";

// ****************************************

const create = serviceFactory.create(Portfolio);
const getAll = serviceFactory.getAll(Portfolio);
const getById = serviceFactory.getById(Portfolio);
const update = serviceFactory.update(Portfolio);
const _delete = serviceFactory._delete(Portfolio);

const portfolioService = { create, update, _delete, getAll, getById };

export default portfolioService;
