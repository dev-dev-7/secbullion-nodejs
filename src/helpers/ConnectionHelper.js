const DBAccess = require('../db');

/**
 * Process when user connect (call for each user connection)
 * @param {string} token user access token
 * @param {string} user_id user id
 * @param {any} socket is socket for emit data
 */
const userConnect = (user_id, socket_id, socket) => {
  return new Promise(async (resolve, reject) => {
    if (!user_id || !socket_id) // Is parameter exist?
      return reject({ Status: false, Message: 'Invalid parameter', Data: null });
    try {
      // user = await DBAccess.user.getUserByToken(token);
      // user_id = user[0].id;
      await DBAccess.message.updateUserLastSeenAsOnline(user_id, socket_id);
      let messages = await DBAccess.message.getUndelievredMessagesOfusser(user_id); // GET UN DELIVERED MESSAGE
      let message_entity;
      if (messages.length > 0) {
        console.log("UN DELIVERED MESSAGE LENGTH : ", messages.length);
        for (let i = 0; i < messages.length; i++) {
          message_entity = {
            chatid: messages[i].chatid,
            sender: messages[i].sender.toString(),
            reciever: messages[i].reciever.toString(),
            message: messages[i].message,
            senderName: messages[i].senderName,
            senderImage: messages[i].senderImage,
            status: messages[i].status,
            time: new Date()
          };
          let reciever = await DBAccess.user.getUserById(messages[i].reciever);
          if (reciever.length > 0 && reciever[0].socket_id) { // CHECK USER ONLINE
            console.log("MESSAGE EMIT chat_message : ", message_entity);
            socket.emit("chat_message", message_entity);
            await DBAccess.message.updateMessageStatus(messages[i].chatid, 2); // UPDATE DELIVERY STATUS
            let sender = await DBAccess.user.getUserById(messages[i].sender);
            if (sender.length > 0 && sender[0].socket_id) {
              console.log(" MESSAGE DELIVERED : ", messages[i].chatid);
              socket.to(sender[0].socket_id).emit("message_delivered", messages[i].chatid);
              await DBAccess.message.updateEmitStatus(messages[i].chatid, 2); // UPDATE DELIVERY EMIT STATUS
            }
          }
        }

        // CHECK UN DELIVERED MESSAGE EMIT 
        let messagesEmit = await DBAccess.message.getUndelievredMessageEmitOfusser(user_id);
        if (messagesEmit.length > 0) {
          console.log("UN DELIVERED MESSAGE EMIT : ", messagesEmit.length);
          for (let i = 0; i < messagesEmit.length; i++) {
            let sender = await DBAccess.user.getUserById(messagesEmit[i].sender);
            if (sender.length > 0 && sender[0].socket_id) {
              console.log("MESSAGE DELIVERED 2 : ", messagesEmit[i].chatid);
              socket.to(sender[0].socket_id).emit("message_delivered", messagesEmit[i].chatid);
              await DBAccess.message.updateEmitStatus(messagesEmit[i].chatid, 2); // UPDATE DELIVERY EMIT STATUS
            }
          }
        }

      }


    } catch (err) {
    }
  })

}

// Returns a Promise that resolves after "ms" Milliseconds
function timer(ms) {
  return new Promise(res => setTimeout(res, ms));
}

const userDisconnect = (user_id, socket) => {
  return new Promise(async (resolve, reject) => {
    if (!user_id)  // Is parameter exist?
      return reject({ Status: false, Message: 'Invalid parameter', Data: null });

    try {
      // user = await DBAccess.user.getUserByToken(token);
      // user_id = user[0].id;
    } catch (err) {

    }
    try {
      await DBAccess.message.updateUserLastSeenAsOffline(user_id);
      // let users = await DBAccess.message.getConnectedOnlineUserOfOtherUser(user_id);
      // for(let i = 0; i < users.length; i++){
      //     socket.to(users[i].socket_id).emit('user_info', { // Emit user online or not
      //         id: user_id,  // Send my id to check client side
      //         status: new Date()
      //     })
      // }
      // Emit all user data
    } catch (err) {

    }
  })
}

module.exports = {
  userConnect,
  userDisconnect
}