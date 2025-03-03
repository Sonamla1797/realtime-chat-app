import mongoose, { Schema, Document,Types} from "mongoose";

export interface UserDocument extends Document {
  _id: Types.ObjectId; 
  name: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<UserDocument>("User", UserSchema);
