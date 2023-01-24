require("dotenv").config();
const { validationResult } = require("express-validator");
const orderModel = require("../order/orderModel");
const productModel = require("../product/productModel");
const walletModel = require("../wallet/walletModel");
const authModel = require("../auth/authModel");
const categoryModel = require("../category/categoryModel");
const transactionModel = require("../transaction/transactionModel");
const bankDetailsModel = require("../bankDetails/bankDetailsModel");
const {
  getAllSymbolsPrice,
  getSymbolPrice,
} = require("../../helpers/mt5Commands/getProductPrice");

exports.getAll = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  const wallet = await walletModel.getWalletByUserId(req.body.user_id);
  // All Products
  const products = await productModel.getActiveProducts();
  let mt5PriceArray = await getAllSymbolsPrice(products);
  if (products.length) {
    for (var p = 0; p < products.length; p++) {
      products[p].files = await productModel.getByFilesByProduct(
        products[p].id
      );
      products[p].value = {
        currency: process.env.DEFAULT_CURRENCY,
        unit: products[p].unit,
        price: await getPriceFromSymbol(mt5PriceArray, products[p].symbol),
        current_rate: products[p].price,
      };
    }
  }
  // My Stake
  const stake = await orderModel.getByType(req.body.user_id, ["stake"]);
  if (stake) {
    for (var t = 0; t < stake.length; t++) {
      stake[t].product = await productModel.getById(stake[t].product_id);
      if (stake[t].product) {
        stake[t].product.files = await productModel.getByFilesByProduct(
          stake[t].product_id
        );
        stake[t].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: stake[t].product.unit,
          price: await getPriceFromSymbol(
            mt5PriceArray,
            stake[t].product.symbol
          ),
          current_rate: stake[t].product.price,
        };
      }
    }
  }
  // My Store
  const store = await orderModel.getByType(req.body.user_id, ["store"]);
  if (store) {
    for (var s = 0; s < store.length; s++) {
      store[s].product = await productModel.getById(store[s].product_id);
      if (store[s].product) {
        store[s].product.files = await productModel.getByFilesByProduct(
          store[s].product_id
        );
        store[s].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: store[s].product.unit,
          price: await getPriceFromSymbol(
            mt5PriceArray,
            store[s].product.symbol
          ),
          current_rate: store[s].product.price,
        };
      }
    }
  }
  // My Order
  const order = await orderModel.getByType(req.body.user_id, [
    "collect",
    "deliver",
  ]);
  if (order) {
    for (var o = 0; o < order.length; o++) {
      order[o].product = await productModel.getById(order[o].product_id);
      if (order[o].product) {
        order[o].product.files = await productModel.getByFilesByProduct(
          order[o].product_id
        );
        order[o].product.value = {
          currency: process.env.DEFAULT_CURRENCY,
          unit: order[o].product.unit,
          price: await getPriceFromSymbol(
            mt5PriceArray,
            order[o].product.symbol
          ),
          current_rate: order[o].product.price,
        };
      }
    }
  }
  // Trnsaction
  const transactions = await transactionModel.getTransactionByUserId(
    req.body.user_id
  );
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
      );
    }
  }
  let result = {
    symbols: mt5PriceArray,
    currency: process.env.DEFAULT_CURRENCY,
    gold_rate: await getSymbolPrice("PAMPSuisse-1gm"),
    category: await categoryModel.getActive(),
    wallet: { balance: wallet, transactions: transactions },
    products: products,
    my_stake: stake,
    my_store: store,
    my_order: order,
    metadata: await authModel.getUserMetaData(req.body.user_id),
  };
  return res.status(200).json({ data: result });
};

async function getPriceFromSymbol(symbols = "", key = "") {
  if (symbols && key) {
    let result = symbols.filter(function (symbol) {
      return symbol.Symbol == key;
    });
    return result[0]?.Ask;
  } else {
    return 60;
  }
}
