import express from 'express';
import { getUserDashboardStats } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   GET /api/users/dashboard-stats
 * @desc    Get stats for user dashboard
 * @access  Private
 */
router.get('/dashboard-stats', protect, getUserDashboardStats);

export default router;
