const walletModel = require("./walletModel");
const { validationResult } = require("express-validator");

exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let carts = await walletModel.getWalletByUserId(req.params.user_id);
  if (carts) {
    return res.status(201).json({ data: carts });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
