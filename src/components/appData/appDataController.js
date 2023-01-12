const model = require("./appDataModel");

exports.appData = async (req, res) => {
  const metadata = await model.getActive();
  return res.status(201).json({ data: metadata });
};
