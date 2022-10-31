// @ts-nocheck
import mongoose from "mongoose";
import chalk from "chalk";

import config from "../index.js";

let DB = config.mongodb.MONGO_DB_URI_PRO;

try {
  if (DB !== undefined) {
    mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });

    mongoose.connection
      .on("connected", function () {
        console.log(chalk.greenBright("mongoose connection ready"));
      })
      .on("error", function () {
        console.log(chalk.redBright("mongoose connection error"));
      })
      .on("disconnected", function () {
        console.log(chalk.redBright("mongoose connection disconnected"));
      });
  }
} catch (err) {
  console.error(err);
}
