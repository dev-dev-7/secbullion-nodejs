const model = require("./../transactionModel");
const bankDetailsModel = require("./../../bankDetails/bankDetailsModel");
const walletModel = require("./../../wallet/walletModel");

exports.get = async (req, res) => {
  const transactions = await model.getAllTransactions();
  if (transactions) {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].bankDetails = await bankDetailsModel.getBankById(
        transactions[i].bank_detail_id
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
  const transaction = await model.getTransactionById(req.params.transaction_id);
  if (transaction && transaction.status == 0) {
    let wallet = await walletModel.getWalletByUserId(transaction.user_id);
    let walletBalance = wallet.cash_balance + transaction.amount;
    await model.updateTransaction(req.params.transaction_id, { status: 1 });
    await walletModel.updateWallet(transaction.user_id, {
      cash_balance: walletBalance,
    });
    await walletModel.insertWalletHistory(
      transaction.user_id,
      "deposit",
      "balance",
      transaction.amount,
      transaction.reference_number
    );
    return res.status(200).json({
      data: await model.getTransactionById(req.params.transaction_id),
      msg: "Transaction Approved",
    });
  } else {
    return res.status(400).json({ errors: [{ msg: "Bad Request" }] });
  }
};
