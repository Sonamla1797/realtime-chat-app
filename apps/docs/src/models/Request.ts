import mongoose, { Schema, Document } from 'mongoose';

export interface FriendRequestDocument extends Document {
  sender: mongoose.Types.ObjectId; // User who sent the friend request
  receiver: mongoose.Types.ObjectId; // User who received the friend request
  status: 'pending' | 'accepted' | 'declined'; // Status of the request
  createdAt: Date;
}

const friendRequestSchema = new Schema<FriendRequestDocument>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export const FriendRequest = mongoose.model<FriendRequestDocument>('FriendRequest', friendRequestSchema);
