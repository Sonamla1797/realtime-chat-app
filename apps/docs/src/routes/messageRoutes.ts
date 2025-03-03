/* import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

// Send a message in a chat
router.post("/", authenticateUser, sendMessage);

// Get all messages in a chat
router.get("/:chatId", authenticateUser, getMessages);

export default router;
 */