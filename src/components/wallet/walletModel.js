const db = require("../../config/connection");
const walletTable = "tbl_user_wallets";
const walletHistoryTable = "tbl_user_wallet_history";

const getWalletByUserId = (user_id) => {
  return db(walletTable).where("user_id", user_id).first();
};

const insertWallet = async (
  user_id,
  cash_balance,
  commodities,
  staking,
  currency
) => {
  return db(walletTable).insert({
    user_id: user_id,
    cash_balance: cash_balance ? cash_balance : 0,
    commodities: commodities ? commodities : 0,
    staking: staking ? staking : 0,
    currency: currency,
  });
};

const updateWallet = async (user_id, data) => {
  return db(walletTable)
    .where({ user_id: user_id })
    .update(data)
    .then((updated) => getWalletByUserId(user_id));
};

const insertWalletHistory = async (user_id, comment, amount) => {
  return db(walletHistoryTable).insert({
    user_id: user_id,
    comment: comment,
    amount: amount,
  });
};

module.exports = {
  getWalletByUserId,
  insertWallet,
  updateWallet,
  insertWalletHistory,
};
