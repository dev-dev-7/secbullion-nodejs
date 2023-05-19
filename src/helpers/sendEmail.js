const nodemailer = require("nodemailer");

const sendEmail = async (name, email, token_url) => {
  let email_sub = "Activation of Secbullion Account";
  let htmlBody =
      "Dear "+name+",<br/><br/>Thank you for registering with us. To activate your account, please click on the following link and upload required documents:<br/><br/>" +
      token_url +
      "<br/><br/>If the upload document page doesn't open, you can copy and paste the above link into your preferred browser.<br/><br/>Should you require any assistance, please don't hesitate to reach out to your Secbullion contact person.<br/><br/>Sec Bullion";
  let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "leafmillion@gmail.com", // generated ethereal user
      pass: "dcatrduqwneufgox", // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: '"Secbullion" <leafmillion@gmail.com>',
    to: email, // list of receivers
    subject: email_sub, // Subject line
    html: htmlBody, // html body
  });
  return info.messageId;
};

module.exports = { sendEmail };