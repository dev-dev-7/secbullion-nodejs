const config = require("../config/index");
// const twilio = require("twilio")(
//   config.development.TWILIO_ACCOUNT_SID,
//   config.development.TWILIO_AUTH_TOKEN
// );
const apiKey = config.smsglobal.API_KEY;
const apiSecret = config.smsglobal.SECRETE_KEY;
var smsglobal = require("smsglobal")(apiKey, apiSecret);

const sendMessage = (phone, otp_code) => {
  // twilio.messages
  //   .create({
  //     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
  //     from: phoneNumber,
  //     to: phone,
  //   })
  //   .then((message) => console.log(message.sid))
  //   .catch((err) => console.error(err));
  // twilio.verify
  //   .services(config.development.TWILIO_VERIFICATION_SERVICE_ID)
  //   .verifications.create({ to: phone, channel: "sms" })
  //   .then((verification) => console.log(verification.status));
  var payload = {
    origin: "SEC",
    destination: phone,
    message: "One time otp for secbullion is " + otp_code,
  };
  smsglobal.sms.send(payload, function (error, response) {
    // console.log(response);
    return true;
  });
};

module.exports = { sendMessage };
