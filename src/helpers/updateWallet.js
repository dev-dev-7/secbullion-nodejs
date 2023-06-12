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
  let wallet = await walletModel.getWalletByUserId(user_id);
  // var updateWalletAmount = eval(wallet.cash_balance + operation + amount);
  var updateAmount = eval(operation + amount);
  const userMetadata = await profileModel.getUserMetaDataKey(
    user_id,
    "mt5_account_no"
  );
  await updateMT5Balance(userMetadata.meta_values, updateAmount, comment);
  let mt5Balance = await getMT5Balance(userMetadata.meta_values);
  await walletModel.updateWallet(user_id, {
    cash_balance: mt5Balance.Balance,
  });
  await walletModel.insertWalletHistory(
    user_id,
    comment.replace(/%20/g, " "),
    updateAmount
  );
  return;
};
