// routes/sessions.js
import express from 'express';
import {
  bookSession,
  getUserSessions,
  updateSessionStatus
} from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserSessions);
router.post('/', protect, bookSession);
router.put('/:id/status', protect, updateSessionStatus);

export default router;