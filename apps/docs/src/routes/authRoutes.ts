import express from "express";
import { signup, login } from "../controllers/authController";

const router = express.Router();

// Helper function to wrap async functions and pass errors to Express
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Use the asyncHandler to wrap your routes
router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.get("/signup", (req,res,next)=>{
  res.send("signup")  
})
export default router;
