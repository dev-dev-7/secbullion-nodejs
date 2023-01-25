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
        if (response?.data[0]) {
          return response.data;
        } else {
          return 0;
        }
      });
  } catch (err) {
    return 0;
  }
};

exports.getSymbolPrice = async (symbol) => {
  const formData = new FormData();
  formData.append("Symbols", "GOLD.1g");
  try {
    return await axios
      .post("https://personal.sec-markets.com/mt5/prices", formData, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      })
      .then(function (response) {
        if (response?.data?.Success) {
          return response.data[0]?.Ask;
        } else {
          return 0;
        }
      });
  } catch (err) {
    return 0;
  }
};

exports.getPriceFromSymbol = async (symbols = "", key = "") => {
  if (symbols && key) {
    let result = symbols.filter(function (symbol) {
      return symbol.Symbol == key;
    });
    return result[0]?.Ask;
  } else {
    return 0;
  }
};
