const orderModel = require("./orderModel");
const { validationResult } = require("express-validator");

exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let existOrder = await orderModel.getByTaxnId(req.body.txn_token);
  if (!existOrder) {
    let order = await orderModel.create(req.body);
    return res.status(201).json({ data: order });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
