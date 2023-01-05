const { validationResult } = require("express-validator");
const categoryModel = require("../category/categoryModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const wallet = await walletModel.getWalletByUserId(req.body.user_id);
  const category = await categoryModel.getActive();
  if (category.length) {
    for (var i = 0; i < category.length; i++) {
      category[i].products = await productModel.getActiveByCategory(
        category[i].id
      );
      if (category[i].products.length) {
        for (var p = 0; p < category[i].products.length; p++) {
          category[i].products[p].files =
            await productModel.getByFilesByProduct(category[i].products[p].id);
          category[i].products[p].value = { currency: "AED", price: "56.07" };
        }
      }
    }
  }
  let result = {
    currency: "AED",
    gold_rate: "12000",
    wallet: wallet,
    items: category,
  };
  return res.status(201).json({ data: result });
};
