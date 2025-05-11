import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;


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
