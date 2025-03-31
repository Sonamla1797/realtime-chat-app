import { Request, Response, RequestHandler } from "express";
import Chat from "../models/Chat";
import { Message } from "../models/Message";
import { AuthRequest } from "../types/types";

// ✅ Create a Chat (One-on-One or Group)
export const createChat: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, participants, type, name } = req.body;

    if (!participants || participants.length < 2) {
      res.status(400).json({ message: "At least two participants required" });
      return;
    }

    const chat = new Chat({
      name: name || null,
      type,
      participants,
    });

    await chat.save();
    res.status(201).json({ message: "Chat created", data: chat });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get User Chats
export const getUserChats: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "username email")
      .populate("messages");
    console.log(chats);
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get Chat by ID (with messages)
export const getChatById: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("participants", "username email")
      .populate({ path: "messages", model: Message });

    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
export const removeChat: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { chatId } = req.params;
      const { userId } = req.body;
  
      // Find the chat by ID
      const chat = await Chat.findById(chatId);
  
      if (!chat) {
        res.status(404).json({ message: "Chat not found" });
        return;
      }
  
      // Check if the user is a participant of the chat
      if (!chat.participants.includes(userId)) {
        res.status(403).json({ message: "You are not a participant of this chat" });
        return;
      }
  
      // Remove the chat from the database
      await chat.deleteOne();
  
      res.status(200).json({ message: "Chat removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };