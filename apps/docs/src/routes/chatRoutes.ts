import { Router } from "express";
import { createChat, getUserChats, getChatById, removeChat } from "../controllers/chatController";
import {handleChatRoom} from "../controllers/chatRoomController"
import { verifyToken } from "../utils/jwt";

const router: Router = Router();

// Route to create a new chat
router.post("/create", verifyToken, createChat);

// Route to get all chats of a user
router.get("/user", verifyToken, getUserChats);

// Route to get a specific chat by ID
router.get("/:chatId", verifyToken, getChatById);

//ROute to remoce a specific chat by ID
router.delete("/:chatId", verifyToken, removeChat);

//Route that handels chatroom using chatID
router.get("/live/:chatId", verifyToken, handleChatRoom);

export default router;
