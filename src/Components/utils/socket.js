// src/utils/socketInstance.js
import { io } from "socket.io-client";

const socket = io("http://api.letsconnecty.shop:5001", {
  withCredentials: true,
  transports: ["polling", "websocket"],
  path: "/socket.io",
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("connect_timeout", () => {
  console.error("Socket connection timeout");
});

export default socket;
