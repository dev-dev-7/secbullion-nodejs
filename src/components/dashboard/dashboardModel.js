const db = require("../../config/connection");
const orderTable = "tbl_product_orders";

const getSumOfBusinessToday = (date) => {
  return db(orderTable)
    .sum("subtotal as total")
    .where("created_at", "like", `%${date}%`)
    .first();
};

const getSumOfOrdersToday = (date) => {
  return db(orderTable)
    .count("id as total")
    .where("created_at", "like", `%${date}%`)
    .first();
};

const getSumOfBusinessMonth = (fromDate, toDate) => {
  return db(orderTable)
    .sum("subtotal as total")
    .where("created_at", "like", `%${fromDate}%`)
    .orWhere("created_at", "like", `%${toDate}%`)
    .first();
};

const getSumOfOrdersMonth = (fromDate, toDate) => {
  return db(orderTable)
    .count("id as total")
    .where("created_at", "like", `%${fromDate}%`)
    .orWhere("created_at", "like", `%${toDate}%`)
    .first();
};

const getSumOfBusiness = () => {
  return db(orderTable).sum("subtotal as total").first();
};

const getSumOfOrders = (fromDate, toDate) => {
  return db(orderTable).count("id as total").first();
};

module.exports = {
  getSumOfBusinessToday,
  getSumOfOrdersToday,
  getSumOfBusinessMonth,
  getSumOfOrdersMonth,
  getSumOfBusiness,
  getSumOfOrders,
};
