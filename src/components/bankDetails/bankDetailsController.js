const model = require("./bankDetailsModel");
const { validationResult } = require("express-validator");

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let exist;
  exist = await model.getBankByIban(req.body.user_id, req.body.iban);
  if (!exist) {
    exist = await model.create(req.body);
  }
  return res.status(201).json({ data: exist });
};

exports.get = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let banks = await model.getBankByUserId(req.params.user_id);
  if (banks) {
    return res.status(201).json({ data: banks });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let existBank = await model.getBankByIban(req.params.user_id, req.body.iban);
  if (existBank) {
    let bank = await model.update(req.params.user_id, req.body.id, req.body);
    return res.status(200).json({ data: bank });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.delete = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let del = await model.deleteUserBank(req.params.user_id, req.params.id);
  if (del) {
    return res.status(200).json({
      data: await model.getBankByUserId(req.params.user_id),
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
