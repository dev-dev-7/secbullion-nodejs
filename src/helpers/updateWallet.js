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
  console.log(amount);
  let wallet = await walletModel.getWalletByUserId(user_id);
  // let mt5Balance = await getMT5Balance(userMetadata.meta_values);
  // console.log("mt5Balance: ", mt5Balance.Balance);
  await walletModel.updateWallet(user_id, {
    cash_balance:
      operation == "+"
        ? wallet.cash_balance + amount
        : wallet.cash_balance - amount,
  });
  let amountTo = operation + "" + amount;
  await walletModel.insertWalletHistory(
    user_id,
    comment.replace(/%20/g, " "),
    amountTo
  );
  await updateMT5Balance(userMetadata.meta_values, amountTo, comment);
  return;
};
