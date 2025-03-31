import { Router } from "express";
import { sendMessage, getChatMessages, deleteMessage } from "../controllers/messageController";
import { verifyToken } from "../utils/jwt";

const router: Router = Router();

// Route to send a message
router.post("/send", verifyToken, sendMessage);

// Route to get chat messages
router.get("/:chatId", verifyToken, getChatMessages);

//Router to delete a message
router.delete("/:messageId", verifyToken, deleteMessage);

export default router;
