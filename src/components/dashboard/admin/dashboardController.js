require("dotenv").config();
const model = require("../dashboardModel");

exports.get = async (req, res) => {
  let result = {
    currency: process.env.DEFAULT_CURRENCY,
    today_business:100,
    monthly_business:10000,
    total_business:300000
  }
  return res.status(201).json({ data: result });
};