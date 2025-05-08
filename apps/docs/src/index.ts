
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http"; // Import http for socket.io
import authRoutes from "./routes/authRoutes";
import requestRoutes from "./routes/requestRoutes";
import friendRoutes from "./routes/friendsRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import { Message } from "./models/Message";
import {Server} from "socket.io"; // Import Server from socket.io 
import { connectDB } from "./db";
import os from "os"; // Import os to get local IP address
// Load environment variables
dotenv.config();

const app = express();
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const PORT = 5000;
const LOCAL_IP = getLocalIp();
// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors({
  origin: `http://localhost:5173`,  // your React frontend origin
  credentials: true,
}));


// Database Connection
connectDB();

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server, { cors: { origin: `*` } });
const userSocketMap = new Map(); // or a plain object {}

// WebSocket Logic: Handling connections and messages
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("register", ({ userId }) => {
    userSocketMap.set(userId, socket.id); // save the mapping
  });
    // Joining a call room (1-1 or group)
  socket.on('join-call', ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
  });
    // 📞 New: handle outgoing call
  socket.on("call-user", ({ to, signal, from }) => {
    const callerSocketId = userSocketMap.get(from); // get caller's socket ID 
    const targetSocketId = userSocketMap.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { from: callerSocketId, signal });
    }
    console.log(`User ${from} is calling ${to}`);
  });
  // Handling offer from a caller
  socket.on('offer', ({ targetSocketId, offer, from }) => {
    io.to(targetSocketId).emit('offer', { offer, from });
  });
/*   socket.on("incoming-call", ({ from, signal }) => {
    console.log(`Incoming call from ${from}`);  
    socket.emit("incoming-call", { from, signal }); // Emit to the caller
  }); */
  // Handling answer from a receiver
    socket.on('answer', ({ to, signal }) => {
      console.log(`Answering call to ${to}`);
      io.to(to).emit('answer', { signal});
    });
  // ❌ New: handle rejection (optional)
  socket.on("reject-call", ({ userId }) => {
    const targetSocketId = userSocketMap.get(userId);
    if (targetSocketId) {
      io.to(targetSocketId).emit("reject-call"); // this will trigger frontend alert
    }
  });

  // ICE candidates exchange
  socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('ice-candidate', { candidate });
  });

  // Handle leaving
  socket.on('leave-call', ({ roomId, userId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { userId, socketId: socket.id });
  });

  // Handle user joining a specific chat room
  socket.on("joinChat", (chatId: string) => {
    socket.join(chatId);  // Join the chat room identified by chatId
    console.log(`User joined chat room ${chatId}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const { chatId, sender, content } = data;
   console.log("Received message:", data);  

    try {
      
      // Save the message to the database
      const newMessage = new Message({
        chatId,
        sender: sender,
        content:content,
      });

      await newMessage.save();

      // Emit the message to all users in the chat room
      io.to(chatId).emit("message", {
        content: newMessage.content,
        timestamp: newMessage.timestamp,
        sender: newMessage.sender,
      });

      console.log("Message saved and broadcasted");
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Disconnect a user
  socket.on("disconnect", () => {
    console.log("User disconnected");
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  });
  
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/req", requestRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("🚀 Chat App Backend Running!");
});

/* 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running and accessible at: http://${LOCAL_IP}:${PORT}`);
  console.log(`✅ WebSocket server is running and accessible at: ws://${LOCAL_IP}:${PORT}`);
});
 */
// Start Server

const HOST = '172.20.10.7';
server.listen(PORT , () => {
  console.log("Server is running on http://0.0.0.0:5000");
});                 