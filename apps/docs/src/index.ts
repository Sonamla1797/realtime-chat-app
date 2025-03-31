/* import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Socket.io WebSocket connection
io.on("connection", (socket) => {
  

  
  
  console.log("User connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Received:", msg);
    io.emit("message", `Server: ${msg}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ✅ Add a GET endpoint
app.get("/", (req, res) => {
  res.send("Hello! This is a GET API running alongside WebSockets.");
});

// ✅ Add another GET endpoint
app.get("/status", (req, res) => {
  res.json({ status: "Server is running", clients: io.engine.clientsCount });
});

// Start the server
server.listen(8080, () => console.log("Server running on port 5000"));
 */
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
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS for frontend access

// Database Connection
connectDB();

// Create HTTP server for WebSocket
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server, { cors: { origin: "*" } });

// WebSocket Logic: Handling connections and messages
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle user joining a specific chat room
  socket.on("joinChat", (chatId: string) => {
    socket.join(chatId);  // Join the chat room identified by chatId
    console.log(`User joined chat room ${chatId}`);
  });

  // Handle incoming messages
  socket.on("sendMessage", async (data) => {
    const { chatId, senderId, content } = data;

    try {
      
      // Save the message to the database
      const newMessage = new Message({
        chatId,
        sender: senderId,
        content,
      });

      await newMessage.save();

      // Emit the message to all users in the chat room
      io.to(chatId).emit("message", {
        senderId,
        content,
        timestamp: newMessage.timestamp,
      });

      console.log("Message saved and broadcasted");
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Disconnect a user
  socket.on("disconnect", () => {
    console.log("User disconnected");
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

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
                            

/* 
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import requestRoutes from "./routes/requestRoutes"; 
import friendRoutes from "./routes/friendsRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import { connectDB } from "./db";
// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS for frontend access

// Database Connection

connectDB();
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
 */