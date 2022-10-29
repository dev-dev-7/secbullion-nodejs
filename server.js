// @ts-nocheck
// const app = require("./src/app");
import app from "./src/app.js";
import http from "http";
import chalk from "chalk";
import config from "./src/config/index.js";
import "./src/config/mongoose.js";

const server = http.createServer(app);
// const config = require("./src/config");
// const chalk = require("chalk");

// const mongodb = require("./src/config/mongoose");
const PORT = config.app.PORT || 8080;
const CURRENT_ENV = config.app.NODE_ENV || "development";

console.log(chalk.bgBlue(chalk.greenBright("Current ENV :", CURRENT_ENV)));

server.listen(PORT, () => {
  console.log(
    chalk.cyanBright("Server running on port ") + chalk.greenBright(PORT)
  );
});
