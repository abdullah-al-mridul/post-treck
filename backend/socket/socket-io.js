let ioInstance;

const socektConnection = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🔥 A user connected: " + socket.id);

    socket.on("sendMessage", (message) => {
      console.log("📩 Message received:", message);
    });

    socket.on("typing", ({ chatId, isTyping }) => {
      console.log("👤 User typing:", isTyping);
      socket.emit("userTyping", { chatId, isTyping });
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
