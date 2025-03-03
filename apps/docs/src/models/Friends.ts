import mongoose, { Schema, Document } from 'mongoose';

export interface FriendsDocument extends Document {
  userId: mongoose.Types.ObjectId; // User who owns the friends list
  friends: mongoose.Types.ObjectId[]; // Array of friends (user references)
}

const friendsSchema = new Schema<FriendsDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
});

export const Friends = mongoose.model<FriendsDocument>('Friends', friendsSchema);
