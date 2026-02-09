import express from 'express';
import {
    addItem,
    getAllItems,
    getItemById,
    deleteItem,
    updateItemStatus,
    markItemAsCollected,
    getUserItems,
    updateItemDetails
} from '../controllers/item.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload, { handleMulterError } from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   POST /api/items
 * @desc    Add new item (with image upload)
 * @access  Private (logged in users)
 */
router.post(
    '/',
    protect,
    upload.single('image'),
    handleMulterError,
    addItem
);

/**
 * @route   GET /api/items/user/me
 * @desc    Get logged-in user's posted items
 * @access  Private
 */
router.get('/user/me', protect, getUserItems);

/**
 * @route   GET /api/items
 * @desc    Get all items (with optional search and filter)
 * @access  Public
 */
router.get('/', getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get single item by ID
 * @access  Public
 */
router.get('/:id', getItemById);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete item (Admin only)
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), deleteItem);

/**
 * @route   PUT /api/items/:id/status
 * @desc    Update item status (mark as claimed)
 * @access  Private/Admin
 */
router.put('/:id/status', protect, authorize('admin'), updateItemStatus);

/**
 * @route   PUT /api/items/:id
 * @desc    Update item details
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), upload.single('image'), handleMulterError, updateItemDetails);

/**
 * @route   PUT /api/items/:id/complete
 * @desc    Mark item as collected (archive)
 * @access  Private/Admin
 */
router.put('/:id/complete', protect, authorize('admin'), markItemAsCollected);

export default router;
