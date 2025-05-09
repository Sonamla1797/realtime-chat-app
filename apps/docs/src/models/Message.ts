import mongoose, { Schema, Document } from 'mongoose';

export interface MessageDocument extends Document {
  chatId: mongoose.Types.ObjectId; // Reference to Chat model
  sender: string; // Reference to User model
  content: string; // Message content
  timestamp: Date;
}

const messageSchema = new Schema<MessageDocument>({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Message = mongoose.model<MessageDocument>('Message', messageSchema);
