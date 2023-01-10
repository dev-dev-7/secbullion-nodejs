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
