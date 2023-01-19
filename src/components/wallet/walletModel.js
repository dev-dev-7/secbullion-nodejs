const db = require("../../config/connection");
const walletTable = "tbl_user_wallets";

const getWalletByUserId = (user_id) => {
  return db(walletTable).where("user_id", user_id).first();
};

const insertWallet = async (user_id, cash_balance, commodities, staking) => {
  return db(walletTable).insert({
    user_id: user_id,
    cash_balance: cash_balance ? cash_balance : 0,
    commodities: commodities ? commodities : 0,
    staking: staking ? staking : 0,
  });
};

const updateWallet = async (user_id, data) => {
  return db(walletTable)
    .where({ user_id: user_id })
    .update(data)
    .then((updated) => getWalletByUserId(user_id));
};

module.exports = {
  getWalletByUserId,
  insertWallet,
  updateWallet,
};
