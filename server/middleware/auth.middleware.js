import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Protect routes - Verify JWT token
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            const err = new Error('Not authorized, token failed');
            next(err);
        }
    }

    if (!token) {
        res.status(401);
        const err = new Error('Not authorized, no token');
        next(err);
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            const err = new Error(
                `User role ${req.user.role} is not authorized to access this route`
            );
            next(err);
        }
        next();
    };
};

// Grant access to admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        const err = new Error('Not authorized as an admin');
        next(err);
    }
};
