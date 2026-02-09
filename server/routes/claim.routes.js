import express from 'express';
import {
    createClaim,
    getClaims,
    getUserClaims,
    updateClaimStatus
} from '../controllers/claim.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public/User Routes
router.post('/', protect, createClaim);
router.get('/user', protect, getUserClaims);

// Admin Routes
router.get('/', protect, authorize('admin'), getClaims);
router.put('/:id', protect, authorize('admin'), updateClaimStatus);

export default router;
