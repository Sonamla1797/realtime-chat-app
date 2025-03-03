import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  name?: string; // Optional for one-on-one chats
  type: "one-on-one" | "group";
  participants: mongoose.Types.ObjectId[]; // References User _id
  messages: mongoose.Types.ObjectId[]; // References Message _id
  createdAt: Date;
}

const ChatSchema: Schema = new Schema<IChat>(
  {
    name: { type: String, required: false },
    type: { type: String, enum: ["one-on-one", "group"], required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);
export default Chat;
