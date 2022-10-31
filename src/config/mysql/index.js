import config from "../index.js";

const DBConnection = require("knex")({
  client: "mysql",
  connection: config.mysql,
});

module.exports = DBConnection;
