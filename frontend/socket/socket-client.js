import { io } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
socket.on("connect", () => {
  console.log("Connected to server");
});
export { socket };
