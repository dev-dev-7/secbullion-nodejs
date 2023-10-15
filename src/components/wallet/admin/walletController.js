const walletModel = require("../walletModel");
const { validationResult } = require("express-validator");
const { updateWalletAmount } = require("../../../helpers/updateWallet");

exports.get = async (req, res) => {
  let withdraws = await walletModel.getAllWithdrawal();
  if (withdraws) {
    return res.status(200).json({ data: withdraws });
  } else {
    return res.status(400).json({ msg: "Notfound" });
  }
};

exports.withdrawAccept = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  let withdraw = await walletModel.getWithdrawalById(req.body.id);
  if (withdraw) {
    let message;
    if (parseInt(withdraw.status) === 1) {
      message = "Withdraw Request Reverted";
      await updateWalletAmount(withdraw.user_id, withdraw.amount, "+", message);
    } else {
      message = "Withdraw Request processed";
      await updateWalletAmount(withdraw.user_id, withdraw.amount, "-", message);
    }
    await walletModel.updateWithdrawalStatus(
      req.body.id,
      parseInt(withdraw.status) === 1 ? 0 : 1
    );
    return res.status(200).json({ data: message });
  } else {
    return res.status(404).json({ msg: "Invalid Request" });
  }
};
