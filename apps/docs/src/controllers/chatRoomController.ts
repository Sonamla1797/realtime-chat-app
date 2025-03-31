import { Request, Response } from "express";
import { Message } from "../models/Message";
import { AuthRequest } from "../types/types";

// Handle WebSocket connection for a specific chat room
export const handleChatRoom = (req: AuthRequest, res: Response): void => {
  const { chatId } = req.params;

  // Send a response to acknowledge the WebSocket request
  res.send({ message: `Joining chat room ${chatId}` });
};
