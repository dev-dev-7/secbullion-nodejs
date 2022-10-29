import config from "../config/index.js";
import util from "util";

const { SMSGLOBAL_API_KEY, SMSGLOBAL_API_SECRET } = config.sms_global;

const smsglobal = require("smsglobal")(SMSGLOBAL_API_KEY, SMSGLOBAL_API_SECRET);

// **************************************************************

exports.sendSMS = async (payload) => {
  try {
    const response = await smsglobal.sms.send(payload);
    const res = response.data ? response.data : response;
    return (result = { success: true, data: res });
  } catch (error) {
    console.log(
      "Error:",
      util.inspect(error, { showHidden: false, depth: null, colors: true })
    );
    return (result = { success: false, message: error.status });
  }
};

// **************************************************************

// To send an OTP request
// var payload = {
//   origin: "SMSGlobal",
//   message: "{*code*} is your SMSGlobal verification code.",
//   destination: "61400000000",
//   length: 4,
// };
exports.sendOTPSMS = (payload) => {
  smsglobal.otp.send(payload, function (error, response) {
    if (response) {
      console.log("Response:", response.data ? response.data : response);
    }

    if (error) {
      console.log(
        "Error:",
        util.inspect(error, { showHidden: false, depth: null, colors: true })
      );
    }
  });
};

// // **************************************************************

// To verfiy an OTP code entered by your user
exports.verifyOTPSMS = (payload) => {
  smsglobal.otp
    .verifyByRequestId("request Id", "OTP code")
    .then((response) => {
      console.log("Success:", response);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

// // **************************************************************

// To cancel an OTP request by using destination number
exports.cancelOTPSMS = (payload) => {
  smsglobal.otp
    .cancelByDestination("destintion number")
    .then((response) => {
      console.log("Success:", response);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};
