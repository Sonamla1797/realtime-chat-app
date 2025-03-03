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
import authRoutes from "./routes/authRoutes";
/* import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes"; */
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
/* app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
 */
// Default route

app.get("/", (req, res) => {
  res.send("🚀 Chat App Backend Running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
