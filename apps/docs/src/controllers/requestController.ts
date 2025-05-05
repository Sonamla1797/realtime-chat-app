import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import { FriendRequest } from "../models/Request";
import { AuthRequest } from "../types/types";




// ✅ Send a friend request
export const sendFriendRequest: RequestHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const authReq = req 

    const { receiverEmail } = authReq.body;
    const {requesterId} = authReq.body; 


    // Ensure both users exist
    const receiver = await User.findOne({ email: receiverEmail });
    const requester = await User.findById(requesterId);

    if (!receiver) {
      res.status(404).json({ message: "Receiver not found" });
      return;
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({ requesterId, receiverId: receiver._id });
    if (existingRequest) {
      res.status(400).json({ message: "Friend request already sent" });
      return;
    }

    // Create and save friend request
    const newRequest = new FriendRequest({ requesterId, receiverId: receiver._id });
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
    const { requestId } = req.params;
    const userId = req.headers.userid as string; // Extract userId from headers
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
    await requester.save();
    console.log("friend added");

    receiver.friends.push(requester._id);
    console.log("Receiver before save:", receiver);
      try {
        await receiver.save();
        console.log("friend added2");
      } catch (err) {
        console.error("❌ Error saving receiver:", err);
        
      }
    // Update request status
    request.status = "accepted";
    await request.save();
    console.log("friend added3")
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Reject a friend request
export const rejectFriendRequest: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { requestId } = req.params;
    const userId = req.headers.userid as string; // Extract userId from headers

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
  


    const userId = req.headers.userid as string;
 

    const requests = await FriendRequest.find({ receiverId: userId, status: "pending" }).populate(
      "requesterId",
      "name email"
    );

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
