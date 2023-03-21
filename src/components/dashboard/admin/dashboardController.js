require("dotenv").config();
const model = require("../dashboardModel");

exports.get = async (req, res) => {
  let result = {
    currency: process.env.DEFAULT_CURRENCY,
    today_business:100,
    today_order:2,
    monthly_business:10000,
    monthly_orders:28,
    total_business:300000,
    total_orders:1234
  }
  return res.status(201).json({ data: result });
};