const DBAccess = require("../db");
const { sendPushNotification } = require("../firebase/sendPushNotification");

/**
 * Save sended message and socket user
 * @param {any} data message
 * @param {any} socket is socket for emit data
 */
const saveMessage = async (data, socket) => {
  try {
    let message_entity = {
      chatid: data.id,
      sender: data.sender,
      reciever: data.reciever,
      message: data.message,
      senderName: data.senderName,
      senderImage: data.senderImage,
      status: data.status,
      time: new Date(),
    };

    await DBAccess.message.addNewMessage(message_entity); // Add new message

    let reciever = await DBAccess.user.getUserById(message_entity.reciever);
    if (reciever.length > 0 && reciever[0].socket_id) {
      console.log("MESSAGE EMIT chat_message : ", message_entity);
      socket.to(reciever[0].socket_id).emit("chat_message", message_entity);
      // socket.to(reciever[0].socket_id).emit("mesage_general", {...message_entity, username: sender[0].username});
    } else {
      // If socket id is null, ,it means user is offline.
      // If you notification access for this app you can send notification to taker in here.
      sendPushNotification([reciever[0].fcm], message_entity);
    }
    return { Status: true, Message: "Message sended successfully" };
  } catch (err) {
    return {
      Status: false,
      Message: "There is an unexpected error!",
      Data: null,
    };
  }
};

/**
 * Update DB status and emit message delivered
 * @param {any} chat_id chat ID
 * @param {any} socket is socket for emit data
 */
const messageDelivered = async (chat_id, socket) => {
  try {
    let message = await DBAccess.message.getChatByChatId(chat_id);
    if (message.length > 0 && message[0].sender) {
      await DBAccess.message.updateMessageStatus(chat_id, 2); // Update Delivered Status
      let sender = await DBAccess.user.getUserById(message[0].sender);
      if (sender.length > 0 && sender[0].socket_id) {
        console.log("message_delivered : ", chat_id);
        socket.to(sender[0].socket_id).emit("message_delivered", chat_id);
        await DBAccess.message.updateEmitStatus(chat_id, 2); // Update Delivered Emit Status
      }
    }
    return { Status: true, Message: "Message Delivered successfully" };
  } catch (err) {
    return {
      Status: false,
      Message: "There is an unexpected error!",
      Data: null,
    };
  }
};

module.exports = {
  saveMessage,
  messageDelivered,
};
