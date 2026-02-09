import express from 'express';
import { getDashboardStats } from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected Admin Routes
router.get('/stats', protect, admin, getDashboardStats);

export default router;
