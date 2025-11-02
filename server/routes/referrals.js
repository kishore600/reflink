// routes/referrals.js
import express from 'express';
import {
  submitReferral,
  getUserReferrals,
  updateReferralStatus
} from '../controllers/referralController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserReferrals);
router.post('/', protect, submitReferral);
router.put('/:id/status', protect, updateReferralStatus);

export default router;