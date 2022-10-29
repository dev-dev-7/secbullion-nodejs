import { failed, succeed } from "../../helpers/api.response.js";
import serviceFactory from "../../helpers/service.factory.js";
import Banner from "./banner.model.js";

// ****************************************

const getAll = serviceFactory.getAll(Banner);
const getById = serviceFactory.getById(Banner);
const update = serviceFactory.update(Banner);
const _delete = serviceFactory._delete(Banner);

const create = async (banner) => {
  try {
    const response = await Banner.create(banner);
    return succeed(response);
  } catch (error) {
    console.error(error.message);
    return failed(error.message ?? MESSAGE_COMMON_ERROR.WRONG);
  }
};

// ****************************************

// const update = (Model) => async (filter, update) => {
//   try {
//     if (!mongoose.Types.ObjectId.isValid(filter.id)) {
//       throw new Error("Invalid ID");
//     }
//     const result = await Model.findByIdAndUpdate({ _id: filter.id }, update, {
//       new: true,
//       runValidators: true,
//     });

//     // console.log("result : ", result);

//     return result;
//   } catch (err) {
//     console.error(err.message);
//     throw new Error(err.message);
//   }
// };

const bannerService = { create, update, _delete, getAll, getById };

export default bannerService;
