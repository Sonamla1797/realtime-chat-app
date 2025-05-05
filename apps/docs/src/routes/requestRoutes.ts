import { Router } from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} from '../controllers/requestController';
import { verifyToken } from '../utils/jwt'; 

const router: Router = Router();

// Route to send a friend request
router.post('/request', verifyToken, sendFriendRequest);

// Route to accept a friend request
router.post('/accept/:requestId', verifyToken, acceptFriendRequest);

// Route to reject a friend request
router.post('/reject/:requestId', verifyToken, rejectFriendRequest);

// Route to get all pending friend requests
router.get('/requests', verifyToken, getFriendRequests);

export default router;
  