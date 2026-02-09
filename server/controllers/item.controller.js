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
 * @desc    Update item details (Admin only)
 * @route   PUT /api/items/:id
 * @access  Private/Admin
 */
export const updateItemDetails = async (req, res) => {
    try {
        const { title, description, foundLocation, foundDate, category } = req.body;

        let item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // Update fields
        item.title = title || item.title;
        item.description = description || item.description;
        item.foundLocation = foundLocation || item.foundLocation;
        item.foundDate = foundDate || item.foundDate;
        item.category = category || item.category;

        // Update image if new file uploaded
        if (req.file) {
            // Delete old image
            if (item.image) {
                const oldImagePath = path.join(process.cwd(), 'uploads', item.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            item.image = req.file.filename;
        }

        await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            item
        });

    } catch (error) {
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
        const { search, status, location, date, sort, startDate, endDate } = req.query;

        // Build query
        let query = {};

        // 1. Status Filter
        if (status) {
            if (status === 'all') {
                // Fetch ALL items (including archived/collected)
                delete query.status;
                delete query.isArchived;
            } else {
                query.status = status;
            }
        } else {
            // Default: show available items, NOT archived
            query.status = 'available';
            query.isArchived = false;
        }

        // Handle specific 'collected' status request (Override default)
        if (status === 'collected') {
            delete query.status;
            query.status = 'collected';
            delete query.isArchived;
        }

        // 2. Text Search (Title or Description)
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { foundLocation: { $regex: search, $options: 'i' } }
            ];
        }

        // 3. Location Filter (Exact Match)
        if (location && location !== 'all') {
            query.foundLocation = location;
        }

        // 4. Date Filter
        // Specific Date
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);

            query.foundDate = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        // Date Range
        if (startDate || endDate) {
            query.foundDate = {};
            if (startDate) query.foundDate.$gte = new Date(startDate);
            if (endDate) query.foundDate.$lte = new Date(endDate);
        }

        // 5. Sorting
        let sortOption = { createdAt: -1 }; // Default: Newest first

        switch (sort) {
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'az':
                sortOption = { title: 1 };
                break;
            case 'za':
                sortOption = { title: -1 };
                break;
            case 'recent':
            default:
                sortOption = { foundDate: -1, createdAt: -1 };
                break;
        }

        // Execute Query
        const items = await Item.find(query)
            .populate('postedBy', 'name email phone')
            .sort(sortOption);

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

/**
 * @desc    Get logged-in user's posted items
 * @route   GET /api/items/user/me
 * @access  Private
 */
export const getUserItems = async (req, res) => {
    try {
        const items = await Item.find({ postedBy: req.user._id })
            .sort({ createdAt: -1 })
            .populate('postedBy', 'name');

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
