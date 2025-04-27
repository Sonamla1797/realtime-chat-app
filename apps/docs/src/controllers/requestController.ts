import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import { FriendRequest } from "../models/Request";
import { AuthRequest } from "../types/types";

// ✅ Send a friend request
export const sendFriendRequest: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authReq = req 

    const { receiverId } = authReq.body;
    const {requesterId} = authReq.body; 


    // Ensure both users exist
    const requester = await User.findById(requesterId);
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      res.status(404).json({ message: "Receiver not found" });
      return;
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({ requesterId, receiverId });
    if (existingRequest) {
      res.status(400).json({ message: "Friend request already sent" });
      return;
    }

    // Create and save friend request
    const newRequest = new FriendRequest({ requesterId, receiverId });
    await newRequest.save();

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal this r" });
  }
};

// ✅ Accept a friend request
export const acceptFriendRequest: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { requestId } = authReq.body;
    const {userId} = authReq.body; 

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (request.receiverId.toString() !== userId) {
      res.status(403).json({ message: "Not authorized to accept this request" });
      return;
    }

    if (request.status === "accepted") {
      res.status(400).json({ message: "Request already accepted" });
      return;
    }

    // Add both users to each other's friends list
    const requester = await User.findById(request.requesterId);
    const receiver = await User.findById(request.receiverId);

    if (!requester || !receiver) {
      res.status(404).json({ message: "Users not found" });
      return;
    }

    requester.friends.push(receiver._id);
    receiver.friends.push(requester._id);

    await requester.save();
    await receiver.save();

    // Update request status
    request.status = "accepted";
    await request.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Reject a friend request
export const rejectFriendRequest: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { requestId } = authReq.body;
    const {userId} = authReq.body; 

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      res.status(404).json({ message: "Request not found" });
      return;
    }

    if (request.receiverId.toString() !== userId) {
      res.status(403).json({ message: "Not authorized to reject this request" });
      return;
    }

    await request.deleteOne(); // ✅ Using deleteOne() instead of remove()

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all pending friend requests
export const getFriendRequests: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.headers.userId as string; 

    const requests = await FriendRequest.find({ receiverId: userId, status: "pending" }).populate(
      "requesterId",
      "username email"
    );

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
