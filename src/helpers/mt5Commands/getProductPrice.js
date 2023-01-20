const axios = require("axios");

function getMonth(month) {
  month = month + 1;
  return month < 10 ? "0" + month.toString() : month.toString();
}

exports.getGramPrice = async (quantity) => {
  const today = new Date();
  const options = {
    headers: {
      Accept: "application/json",
      "x-access-token": "goldapi-7ygrtld4hhnh7-io",
    },
  };
  let api_url =
    "https://www.goldapi.io/api/XAU/USD/" +
    today.getFullYear() +
    getMonth(today.getMonth()) +
    (today.getDate() - 1);
  return axios
    .get(api_url, options)
    .then((res) => {
      return res.data.price_gram_24k * quantity;
    })
    .catch((err) => {
      console.log(err);
      return 61 * quantity;
    });
};
