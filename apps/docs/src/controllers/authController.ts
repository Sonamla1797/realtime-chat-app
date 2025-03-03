import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User, UserDocument } from "../models/User";
import { generateToken } from "../utils/jwt";

// Signup handler
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: UserDocument = new User({ name, email, password: hashedPassword });
    await user.save();

    // Fix: Ensure `_id` is correctly typed
    const { accessToken, refreshToken } = generateToken({ userId: user._id.toString(), email: user.email });

    res.status(201).json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login handler
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Fix: Explicitly type user as UserDocument | null
    const user: UserDocument | null = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fix: Convert `_id` to string
    const { accessToken, refreshToken } = generateToken({ userId: user._id.toString(), email: user.email });

    res.status(200).json({
      user: { id: user._id.toString(), name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
