require("dotenv").config();
const walletModel = require("../components/wallet/walletModel");
const profileModel = require("../components/profile/profileModel");
const { updateMT5Balance, getMT5Balance } = require("../helpers/mt5");

exports.updateWalletAmount = async (
  user_id,
  amount,
  operation,
  comment = ""
) => {
  const userMetadata = await profileModel.getUserMetaDataKey(
    user_id,
    "mt5_account_no"
  );
  let wallet = await walletModel.getWalletByUserId(user_id);
  // let mt5Balance = await getMT5Balance(userMetadata.meta_values);
  // console.log("mt5Balance: ", mt5Balance.Balance);
  let arrWalletData = {
    cash_balance: eval(wallet.cash_balance + operation + amount),
  };
  await walletModel.updateWallet(user_id, {
    cash_balance: arrWalletData,
  });
  await updateMT5Balance(
    userMetadata.meta_values,
    eval(operation + amount),
    comment
  );
  await walletModel.insertWalletHistory(
    user_id,
    comment.replace(/%20/g, " "),
    eval(operation + amount)
  );
  return;
};
