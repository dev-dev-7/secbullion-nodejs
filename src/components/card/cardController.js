const model = require("./cardModel");
const { authorization } = require("../../helpers/authorization");
const { validationResult } = require("express-validator");
const { Checkout } = require("checkout-sdk-node");
const cko = new Checkout("sk_sbox_tkktnryd57sile3lkoxcmyd7hax", {
  pk: "pk_sbox_4pruzwhxn4t2ytyu5itz5qyfzym",
  // environment: "sandbox", // or 'production'
});

exports.get = async (req, res) => {
  let user = await authorization(req, res);
  let cards = await model.getAll(user.user_id);
  return res.status(201).json({ data: cards });
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
      if (!card) {
        await model.create(req.body);
      }
      return res.status(201).json({ msg: "New card has been added." });
    } else {
      return res.status(400).json({ msg: "Error in add new card" });
    }
  } catch (err) {
    return res.status(400).json({ msg: err.name });
  }
};
