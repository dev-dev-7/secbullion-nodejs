const https = require("https");
const crypto = require("crypto");
const buffer = require("buffer");

function MT5request(server, port) {
  this.server = server;
  this.port = port;
  this.https = new https.Agent();
  this.https.maxSockets = 1;
}

let gramPrice = 233.75;
let kiloPrice = 233000.75;

exports.getPrice = (quantity, unit) => {
  let total;
  if (unit == "gr") {
    total = parseInt(quantity) * gramPrice;
  } else if (unit == "kl") {
    total = parseInt(quantity) * kiloPrice;
  }
  return total;
};
