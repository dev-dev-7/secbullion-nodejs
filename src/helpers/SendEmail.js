const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = function (data) {
  const msg = {
    to: "wael@ishro.com", // Change to your recipient
    from: "tickets@ishro.com", // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    ...data,
  };

  return sgMail
    .send(msg)
    .then((response) => {
      return response[0].statusCode;
      console.log(response[0].statusCode);
      // console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(JSON.stringify(error));
    });
};
