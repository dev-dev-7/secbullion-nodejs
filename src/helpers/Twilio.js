const config = require("../config/index");
const accountSid = config.development.TWILIO_ACCOUNT_SID;
const authToken = config.development.TWILIO_AUTH_TOKEN;
const phoneNumber = config.development.TWILIO_PHONE_NUMBER;
const serviceId = config.development.TWILIO_VERIFICATION_SERVICE_ID;
const client = require("twilio")(accountSid, authToken);

const Send = (phone) => {
  // client.messages
  //   .create({
  //     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
  //     from: phoneNumber,
  //     to: phone,
  //   })
  //   .then((message) => console.log(message.sid))
  //   .catch((err) => console.error(err));

  client.verify
    .services(serviceId)
    .verifications.create({ to: phone, channel: "sms" })
    .then((verification) => console.log(verification.status));
};

const Verify = async (phone, code) => {
  try {
    const verify = await client.verify
      .services(serviceId)
      .verificationChecks.create({ to: phone, code })
      .then((verification_check) => verification_check.valid);
    return verify;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { Send, Verify };
