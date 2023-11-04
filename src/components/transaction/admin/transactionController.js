const model = require("./../transactionModel");
const bankDetailsModel = require("./../../bankDetails/bankDetailsModel");
const authModel = require("./../../auth/authModel");
const profileModel = require("./../../profile/profileModel");
const { updateWalletAmount } = require("../../../helpers/updateWallet");
const { authorization } = require("../../../helpers/authorization");

exports.get = async (req, res) => {
  const transactions = await model.getAllTransactionsByType("deposit");
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
      );
      transactions[i].user = await authModel.getUserById(
        transactions[i].user_id
      );
      transactions[i].user.id = i + 1;
      transactions[i].user.metadata = await profileModel.getUserMetaData(
        transactions[i].user_id
      );
    }
  }
  if (transactions) {
    return res.status(200).json({ data: transactions });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.update = async (req, res) => {
  let user = await authorization(req, res);
  const transaction = await model.getTransactionById(req.params.transaction_id);
  if (transaction) {
    if (req.body.status == 1) {
      let operationType = transaction.type === "deposit" ? "+" : "-";
      let actionMessage =
        transaction.type === "deposit" ? "Deposit" : "Withdraw";
      await updateWalletAmount(
        transaction.user_id,
        transaction.amount,
        operationType,
        actionMessage
      );
    } else {
      let operationType = transaction.type === "deposit" ? "-" : "+";
      let actionMessage =
        transaction.type === "deposit" ? "Withdraw" : "Deposit";
      await updateWalletAmount(
        transaction.user_id,
        transaction.amount,
        operationType,
        actionMessage
      );
    }
    await model.updateTransaction(req.params.transaction_id, {
      status: req.body.status,
      action_taken_by: user.user_id,
    });
    return res.status(200).json({
      data: await model.getTransactionById(req.params.transaction_id),
      msg: "Transaction Completed",
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};

exports.getWithdrawRequests = async (req, res) => {
  const transactions = await model.getAllTransactionsByType("withdraw");
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
      );
      transactions[i].user = await authModel.getUserById(
        transactions[i].user_id
      );
      transactions[i].user.id = i + 1;
      transactions[i].user.metadata = await profileModel.getUserMetaData(
        transactions[i].user_id
      );
    }
  }
  if (transactions) {
    return res.status(200).json({ data: transactions });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
