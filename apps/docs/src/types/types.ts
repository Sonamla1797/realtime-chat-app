import { Request } from "express";
import { UserAuthPayload } from "../../../../packages/shared/auth";

export interface AuthRequest extends Request {
  user?: UserAuthPayload; // ✅ Adds `user` property to Request

}
