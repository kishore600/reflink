// routes/users.js
import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  createConsultingOffer,
  getUsers
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getUsers);
router.get('/:username', optionalAuth, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/offers', protect, createConsultingOffer);

export default router;