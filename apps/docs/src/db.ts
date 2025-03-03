import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "chat-app", // Optional: Specify DB name explicitly
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
