const firebaseAdmin = require('./firebase')

let options = {
    priority: "normal",
    timeToLive: 60 * 60
  };

const getPayload = (body) => {
    return {
        notification: {
          title: body.senderName,
          body: body.message,
          sound: "default"
        },
        data: {
          message: JSON.stringify(body)
        }
      };
}

const sendPushNotification = function(fcmTokens, body) {
    firebaseAdmin.messaging()
    .sendToDevice(fcmTokens, getPayload(body), options)
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
}

module.exports = {sendPushNotification}