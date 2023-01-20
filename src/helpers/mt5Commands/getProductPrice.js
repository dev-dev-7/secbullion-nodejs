const axios = require("axios");

exports.getGramPrice = async (quantity) => {
  const options = {
    headers: {
      Accept: "application/json",
      "x-access-token": "goldapi-7ygrtld4hhnh7-io",
    },
  };
  return axios
    .get("https://www.goldapi.io/api/XAU/USD/20230119", options)
    .then((res) => {
      return res.data.price_gram_24k * quantity;
    })
    .catch((err) => {
      return err;
    });
};
