const db = require("../../config/connection");
const walletTable = "tbl_user_wallets";

const getWalletByUserId = (user_id) => {
  return db(walletTable).where("user_id", user_id);
};

const insertWallet = async (user_id, cash_balance, commodities, staking) => {
  return db(walletTable).insert({
    user_id: user_id,
    cash_balance: cash_balance ? cash_balance : 0,
    commodities: commodities ? commodities : 0,
    staking: staking ? staking : 0,
  });
};

module.exports = {
  getWalletByUserId,
  insertWallet,
};
