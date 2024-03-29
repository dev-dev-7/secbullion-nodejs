require("dotenv").config();
const model = require("./cardModel");
const { authorization } = require("../../helpers/authorization");
const { validationResult } = require("express-validator");
const { Checkout } = require("checkout-sdk-node");

const cko = new Checkout(process.env.CHECKOUT_SECRETE_KEY, {
  pk: process.env.CHECKOUT_PUBLIC_KEY,
  scope: ["gateway"],
  environment: "production",
});

exports.get = async (req, res) => {
  let user = await authorization(req, res);
  let cards = await model.getAll(user.user_id);
  return res
    .status(200)
    .json({ data: cards, pk_token: process.env.CHECKOUT_PUBLIC_KEY });
};

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let user = await authorization(req, res);
  try {
    const instrument = await cko.instruments.create({
      // infered type "token",
      token: req.body.token,
    });
    if (instrument.id) {
      req.body.user_id = user.user_id;
      req.body.method = "checkout";
      req.body.token = instrument.id;
      req.body.type = instrument.scheme.toLowerCase();
      req.body.last_digit = instrument.last4;
      req.body.expiry_date =
        instrument.expiry_month + "/" + instrument.expiry_year;
      let card = await model.isExistCard(req.body);
      if (card) {
        return res.status(400).json({ msg: "Already added same card" });
      } else {
        await model.create(req.body);
        return res.status(201).json({ msg: "New card has been added." });
      }
    } else {
      return res.status(400).json({ msg: "Error in add new card" });
    }
  } catch (err) {
    return res.status(400).json({ msg: err.name });
  }
};

exports.delete = async (req, res) => {
  let user = await authorization(req, res);
  const card = await model.remove(user.user_id, req.params.id);
  return res.status(201).json({ data: card });
};
