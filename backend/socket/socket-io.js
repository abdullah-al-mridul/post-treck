let ioInstance;

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

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected: " + socket.id);
    });
  });
};

// io অবজেক্টকে অন্য জায়গা থেকে ব্যবহার করার জন্য ফাংশন
const emitMessage = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

export { socektConnection, emitMessage };
