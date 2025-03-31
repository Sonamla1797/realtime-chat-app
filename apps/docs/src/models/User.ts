import mongoose, { Schema, Document, Types } from "mongoose";

// Extend the UserDocument interface to include the friends field
export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image: string;
  friends: Types.ObjectId[]; // Add friends field as an array of ObjectIds
}

// Define the User schema, including the friends field
const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }], // Define friends as an array of ObjectIds
});

// Create and export the User model
export const User = mongoose.model<UserDocument>("User", UserSchema);
