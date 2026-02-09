import express from 'express';
import { check } from 'express-validator';
import { loginUser, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation Middleware
const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];

// Routes
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);

export default router;
