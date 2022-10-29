import handlerFactory from "../../helpers/handler.factory.js";
// import { RESPONSE_PORTDOLIO_FIELDS } from "./portfolio.dto.js";
import portfolioService from "./portfolio.service.js";

// ****************************************************

const create = handlerFactory.create(portfolioService);
const getAll = handlerFactory.getAll(portfolioService);
const getById = handlerFactory.getById(portfolioService);
const update = handlerFactory.update(portfolioService);
const _delete = handlerFactory._delete(portfolioService);

const portfolioController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default portfolioController;
