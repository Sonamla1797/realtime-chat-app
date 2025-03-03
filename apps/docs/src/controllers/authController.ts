import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { User, UserDocument } from "../models/User";
import { generateToken } from "../utils/jwt";

// Signup handler
export const signup = async (req: Request, res: Response, next: NextFunction) => {
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

    // Fix: Convert `_id` properly
    const userId = user._id.toString();
    const { accessToken, refreshToken } = generateToken({ userId, email: user.email });

    return res.status(201).json({
      user: { id: userId, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};

// Login handler
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user: UserDocument | null = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fix: Convert `_id` properly
    const userId = user._id.toString();
    const { accessToken, refreshToken } = generateToken({ userId, email: user.email });

    return res.status(200).json({
      user: { id: userId, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error); // Pass error to the global error handler
  }
};
