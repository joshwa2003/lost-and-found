import Item from '../models/item.model.js';
import fs from 'fs';
import path from 'path';
import { createNotification } from './notification.controller.js';

/**
 * @desc    Add a new lost/found item
 * @route   POST /api/items
 * @access  Private (Logged in users)
 */
export const addItem = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        const { title, description, foundLocation, foundDate } = req.body;

        // Validate required fields
        if (!title || !description || !foundLocation || !foundDate) {
            // Delete uploaded file if validation fails
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create item
        const item = await Item.create({
            title,
            description,
            image: req.file.filename,
            foundLocation,
            foundDate,
            postedBy: req.user._id,
            status: 'available'
        });

        // Populate user details
        await item.populate('postedBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Item added successfully',
            item
        });
    } catch (error) {
        // Delete uploaded file if item creation fails
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get all available items
 * @route   GET /api/items
 * @access  Public
 */
export const getAllItems = async (req, res) => {
    try {
        const { search, status } = req.query;

        // Build query
        let query = {};

        // Filter by status (default to available)
        if (status) {
            query.status = status;
        } else {
            // Default: show available items, NOT archived
            query.status = 'available';
            query.isArchived = false;
        }

        // If explicitly asking for archived/collected (e.g. for Admin history), handle it in separate admin route or param
        // For public API, we generally hide archived. 
        // Let's allow overriding isArchived if needed (e.g. status=collected)
        if (status === 'collected') {
            delete query.status; // status conflict if we just set it above
            query.status = 'collected';
            delete query.isArchived; // Allow archived
        }

        // Search functionality (optional)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { foundLocation: { $regex: search, $options: 'i' } }
            ];
        }

        // Get items with user details, sorted by most recent
        const items = await Item.find(query)
            .populate('postedBy', 'name email phone')
            .sort({ foundDate: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Get single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('postedBy', 'name email phone');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(200).json({
            success: true,
            item
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Delete item (Admin only)
 * @route   DELETE /api/items/:id
 * @access  Private/Admin
 */
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Delete image file from uploads folder
        const imagePath = path.join(process.cwd(), 'uploads', item.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete item from database
        await Item.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Update item status (mark as claimed)
 * @route   PUT /api/items/:id/status
 * @access  Private/Admin
 */
export const updateItemStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status || !['available', 'claimed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid status (available or claimed)'
            });
        }

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        item.status = status;
        await item.save();

        res.status(200).json({
            success: true,
            message: 'Item status updated successfully',
            item
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
/**
 * @desc    Mark item as collected (archived)
 * @route   PUT /api/items/:id/complete
 * @access  Private/Admin
 */
export const markItemAsCollected = async (req, res) => {
    try {
        const { collectedBy } = req.body; // user ID who collected it

        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (item.status === 'collected') {
            return res.status(400).json({
                success: false,
                message: 'Item is already marked as collected'
            });
        }

        // Update Item
        item.status = 'collected';
        item.isArchived = true;
        item.collectedDate = new Date();
        if (collectedBy) {
            item.collectedBy = collectedBy;
        }

        await item.save();

        if (collectedBy) {
            await createNotification(
                collectedBy,
                'Item Collected',
                `You have successfully collected "${item.title}". Thank you!`,
                'info'
            );
        }

        res.status(200).json({
            success: true,
            message: 'Item marked as collected and archived',
            item
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
