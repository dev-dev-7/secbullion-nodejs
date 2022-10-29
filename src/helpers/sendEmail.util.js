const config = require("../config");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(config.sendgrid.SENDGRID_API_KEY);

// **************************************************************

/**
 * Send a email
 *
 * @function sendEmail
 * @param  {string} message
 *
 */

exports.sendEmail = async (message) => {
  try {
    const sendEmailResult = await sendGridMail.send(message);
    return { success: true, sendEmailResult };
  } catch (err) {
    console.error("Error sending test email");
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { success: false, message: "Error sending test email" };
  }
};

// **************************************************************

/**
 * Send a Account Registered Email
 *
 * @function sendAccountRegisteredEmail
 * @param  {string} message
 *
 */

exports.sendAccountRegisteredEmail = async (message) => {
  try {
    const sendEmailResult = await sendGridMail.send(message);
    return { success: true, sendEmailResult };
  } catch (err) {
    console.error("Error sending test email");
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    return { success: false, message: "Error sending test email" };
  }
};

// **************************************************************
