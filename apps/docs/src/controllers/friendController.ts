import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import { AuthRequest } from "../types/types";

// ✅ Get all friends of a user
export const getFriends: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.headers.userid as string;
  
    const user = await User.findById(userId).populate("friends", "name email");
  
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Remove a friend
export const removeFriend: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, friendId } = req.body;

    // Find both users
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Remove friendId from user's friends list
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== userId);

    await user.save();
    await friend.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
