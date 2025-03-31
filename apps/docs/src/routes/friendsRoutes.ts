import { Router } from "express";
import { getFriends, removeFriend } from "../controllers/friendController";
import { verifyToken } from "../utils/jwt";

const router: Router = Router();

// Route to get all friends of a user
router.get("/friends", verifyToken, getFriends);

// Route to remove a friend
router.post("/remove", verifyToken, removeFriend);

export default router;
