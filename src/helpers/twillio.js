const config = require("../config/index");
// const twilio = require("twilio")(
//   config.development.TWILIO_ACCOUNT_SID,
//   config.development.TWILIO_AUTH_TOKEN
// );

const sendMessage = (phone) => {
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
};

module.exports = { sendMessage };
