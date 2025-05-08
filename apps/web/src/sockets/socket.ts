import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;
const baseURL = import.meta.env.VITE_API_BASE_URL;  // Make sure this is just the IP or host, without the protocol (http://)

export const getSocket = () => {


  if (!socket) {
    socket = io(`ws://localhost:5000`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }

  return socket;
};
