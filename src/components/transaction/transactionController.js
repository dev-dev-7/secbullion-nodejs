const model = require("./transactionModel");
const bankDetailsModel = require("./../bankDetails/bankDetailsModel");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let exist;
  exist = await model.getTransactionByReference(
    req.body.user_id,
    req.body.reference_number
  );
  if (!exist) {
    exist = await model.create(req.body);
  }
  return res.status(201).json({ msg: "Successfully submitted" });
};

exports.get = async (req, res) => {
  const transactions = await model.getTransactionByUserId(req.params.user_id);
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
      );
    }
  }
  if (transactions) {
    return res.status(200).json({ data: transactions });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
