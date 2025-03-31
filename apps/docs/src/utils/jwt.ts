import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserAuthPayload } from "../../../../packages/shared/auth";
import { AuthRequest } from "../types/types";
const JWT_SECRET = process.env.JWT_SECRET || "topsecret";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";


// ✅ Generate JWT tokens
export const generateToken = (payload: UserAuthPayload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

// ✅ Verify JWT token middleware
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction):void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(403).json({ message: "Invalid authorization format" });
    return; // ✅ Ensure no further execution
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserAuthPayload 

    req.user = decoded; // ✅ Now TypeScript recognizes `req.user`

    next(); // ✅ Ensures request proceeds to the next middleware
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
    return;
  }
};
