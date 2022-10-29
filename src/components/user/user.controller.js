import handlerFactory from "../../helpers/handler.factory.js";
import userService from "./user.service.js";

const create = handlerFactory.create(userService);
const getAll = handlerFactory.getAll(userService);
const getById = handlerFactory.getById(userService);
const update = handlerFactory.update(userService);
const _delete = handlerFactory._delete(userService);

const userController = {
  getAll,
  create,
  getById,
  update,
  _delete,
};

export default userController;
