let ioInstance;
let onlineUsers = new Map();
const socektConnection = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔥 A user connected: " + socket.id);
    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
      console.log(`👥 User ${socket.id} joined chat: ${chatId}`);
    });

    socket.on("leave-chat", (chatId) => {
      socket.leave(chatId);
      console.log(`👋 User ${socket.id} left chat: ${chatId}`);
    });

    socket.on("sendMessage", (message) => {
      console.log("📩 Message received:", message);

      // Broadcast message to everyone in the chat except the sender
      socket.to(message.chatId).emit("new-message", message);
    });

    socket.on("typing", ({ chatId, userId, isTyping }) => {
      console.log("👤 User typing:", userId, isTyping);
      socket.to(chatId).emit("userTyping", { chatId, userId, isTyping });
    });
    socket.on("user-online", (userId) => {
      console.log("user online:" + userId);
      onlineUsers.set(userId, socket.id);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected: " + socket.id);
      let userId = [...onlineUsers.entries()].find(
        ([_, id]) => id === socket.id
      )?.[0];
      if (userId) onlineUsers.delete(userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};
const emitMessage = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};
const emitUnread = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};
export { socektConnection, emitMessage, emitUnread };
