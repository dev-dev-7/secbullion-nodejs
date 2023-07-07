require("dotenv").config();
const model = require("./appDataModel");

exports.appData = async (req, res) => {
  let data = {};
  data.metadata = await model.getActive();
  data.branch_adress = await model.getByUserMetaKey("branch_address");
  data.checkout = {
    secret_key: process.env.CHECKOUT_SECRETE_KEY,
    public_key: process.env.CHECKOUT_PUBLIC_KEY,
  };
  data.usd_to_aed = 3.678;
  return res.status(201).json({ data: data });
};
