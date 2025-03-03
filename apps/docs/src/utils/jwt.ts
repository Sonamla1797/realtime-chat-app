import jwt from "jsonwebtoken";
import { UserAuthPayload } from "../../../../packages/shared/auth";

const JWT_SECRET = process.env.JWT_SECRET || "topsecret";
const ACCESS_TOKEN_EXPIRY = "1h";
const REFRESH_TOKEN_EXPIRY = "7d";

export const generateToken = (payload: UserAuthPayload) => {
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
};

export const verifyToken = (token: string): UserAuthPayload => {
    return jwt.verify(token, JWT_SECRET) as UserAuthPayload;
};
