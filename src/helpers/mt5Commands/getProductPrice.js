const axios = require("axios");
const https = require("https");
var FormData = require("form-data");

exports.getAllSymbolsPrice = async (products) => {
  const formData = new FormData();
  if (products.length) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].symbol) {
        formData.append("Symbols", products[i].symbol);
      }
    }
  }
  try {
    return await axios
      .post("https://personal.sec-markets.com/mt5/prices", formData, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then(function (response) {
        return response.data;
      });
  } catch (err) {
    return err;
  }
};

exports.getSymbolPrice = async (symbol) => {
  const formData = new FormData();
  formData.append("Symbols", symbol);
  try {
    return await axios
      .post("https://personal.sec-markets.com/mt5/prices", formData, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then(function (response) {
        return response.data[0].Ask;
      });
  } catch (err) {
    console.log("error:", err);
  }
};
