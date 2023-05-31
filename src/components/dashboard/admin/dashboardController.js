require("dotenv").config();
const model = require("../dashboardModel");
const { getDateUS, getAddMonth } = require("../../../helpers/time");

exports.get = async (req, res) => {
  let todayDate = getDateUS();
  let nextMonth = await getAddMonth(todayDate, 1);
  let dayBusiness = await model.getSumOfBusinessToday(todayDate);
  let dayOrders = await model.getSumOfOrdersToday(todayDate);
  let monthBusiness = await model.getSumOfBusinessMonth(todayDate, nextMonth);
  let monthOrders = await model.getSumOfOrdersMonth(todayDate, nextMonth);
  let business = await model.getSumOfBusiness();
  let orders = await model.getSumOfOrders();
  let result = {
    currency: process.env.DEFAULT_CURRENCY,
    today_business: dayBusiness.total,
    today_orders: dayOrders.total,
    monthly_business: monthBusiness.total,
    monthly_orders: monthOrders.total,
    total_business: business.total,
    total_orders: orders.total,
  };
  return res.status(201).json({ data: result });
};
