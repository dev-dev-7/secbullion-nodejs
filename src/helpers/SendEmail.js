const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



const deliverEmailNotify = async (order_id, items="") => {
  const msg = {
    to: "dev@ishro.com", // Change to your recipient
    from: "tickets@ishro.com", // Change to your verified sender
    subject: "Secbullion Order: "+order_id,
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>"
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

module.exports = { deliverEmailNotify };