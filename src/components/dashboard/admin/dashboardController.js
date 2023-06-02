require("dotenv").config();
const model = require("../dashboardModel");
const { getDateUS, getAddMonth, createdAt } = require("../../../helpers/time");

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
    today_business: dayBusiness.total ? dayBusiness.total : 0,
    today_orders: dayOrders.total ? dayOrders.total : 0,
    monthly_business: monthBusiness.total ? monthBusiness.total : 0,
    monthly_orders: monthOrders.total ? monthOrders.total : 0,
    total_business: business.total ? business.total : 0,
    total_orders: orders.total ? orders.total : 0,
    default_time: createdAt(),
  };
  return res.status(201).json({ data: result });
};
