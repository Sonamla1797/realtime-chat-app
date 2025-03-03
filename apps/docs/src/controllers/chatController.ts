/* import express from "express";
import { createChat, getUserChats, getChatById } from "../controllers/chatController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Create a new chat (between two users or a group)
router.post("/", authenticateUser, createChat);

// Get all chats of a user
router.get("/", authenticateUser, getUserChats);

// Get a specific chat by ID
router.get("/:chatId", authenticateUser, getChatById);

export default router;
 */