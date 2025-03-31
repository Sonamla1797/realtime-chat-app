import { Request, Response, RequestHandler } from "express";
import { Message } from "../models/Message";
import { AuthRequest } from "../types/types";

// ✅ Send a Message
export const sendMessage: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, chatId, content } = req.body;

    if (!chatId || !content) {
      res.status(400).json({ message: "Chat ID and content are required" });
      return;
    }

    // Create and save the new message
    const message = new Message({
      chatId,
      sender: userId,
      content,
    });

    await message.save();

    // Respond with the saved message and confirmation
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Retrieve Chat History
export const getChatMessages: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      res.status(400).json({ message: "Chat ID is required" });
      return;
    }

    // Fetch messages from the specified chat, sorted by timestamp
    const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a Message
export const deleteMessage: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;

    if (!messageId) {
      res.status(400).json({ message: "Message ID is required" });
      return;
    }

    // Find the message and delete it
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};