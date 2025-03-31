import mongoose, { Document, Schema } from 'mongoose';

export interface IFriendRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
