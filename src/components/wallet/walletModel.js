const db = require("../../config/connection");
const walletTable = "tbl_user_wallets";
const walletWithdrawalTable = "tbl_user_wallet_withdrawal";
const walletHistoryTable = "tbl_user_wallet_history";
const callbackTable = "tbl_callback";

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
  return db(walletTable).where({ user_id: user_id }).update(data);
};

const insertWalletHistory = async (user_id, comment, amount) => {
  return db(walletHistoryTable).insert({
    user_id: user_id,
    comment: comment,
    amount: amount,
  });
};

const insertCallback = async (type, data) => {
  return db(callbackTable).insert({
    type: type,
    data: data,
  });
};

// Withdrawal
const insertWithdrawal = async ({ user_id, amount, currency }) => {
  return db(walletWithdrawalTable).insert({
    user_id: user_id,
    amount: amount ? amount : 0,
    currency: currency,
  });
};

const getAllWithdrawal = () => {
  return db(walletWithdrawalTable).orderBy("id", "DESC").limit(500);
};

const getWithdrawalById = (id) => {
  return db(walletWithdrawalTable).where("id", id).first();
};

const getWithdrawalByUserId = (user_id) => {
  return db(walletWithdrawalTable).where("user_id", user_id);
};

const updateWithdrawalStatus = async (id, status) => {
  return db(walletWithdrawalTable).where({ id: id }).update({ status: status });
};

const existWithdrawalRequest = (user_id) => {
  return db(walletWithdrawalTable)
    .where("user_id", user_id)
    .andWhere("status", 0)
    .first();
};

module.exports = {
  getWalletByUserId,
  insertWallet,
  updateWallet,
  insertWalletHistory,
  insertCallback,
  insertWithdrawal,
  getAllWithdrawal,
  getWithdrawalById,
  getWithdrawalByUserId,
  updateWithdrawalStatus,
  existWithdrawalRequest
};
