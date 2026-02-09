import Claim from '../models/claim.model.js';
import Item from '../models/item.model.js';
import { createNotification } from './notification.controller.js';

/**
 * @desc    Create a new claim
 * @route   POST /api/claims
 * @access  Private (User)
 */
export const createClaim = async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.user._id;

        // 1. Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        // 2. Check if item is available
        if (item.status !== 'available') {
            return res.status(400).json({
                success: false,
                message: 'This item is already claimed or not available'
            });
        }

        // 3. Check if user already claimed this item
        const existingClaim = await Claim.findOne({ itemId, userId });
        if (existingClaim) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a claim for this item'
            });
        }

        // 4. Create Claim
        const claim = await Claim.create({
            itemId,
            userId,
            status: 'pending'
        });

        // 5. Notify User
        await createNotification(
            userId,
            'Claim Submitted',
            `Your claim for "${item.title}" has been submitted successfully.`,
            'success'
        );

        res.status(201).json({
            success: true,
            message: 'Claim submitted successfully',
            data: claim
        });

    } catch (error) {
        console.error('Create Claim Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @desc    Get all claims (Admin only)
 * @route   GET /api/claims
 * @access  Private (Admin)
 */
export const getClaims = async (req, res) => {
    try {
        const claims = await Claim.find()
            .populate('itemId', 'title image status foundLocation')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });
    } catch (error) {
        console.error('Get Claims Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @desc    Get logged in user's claims
 * @route   GET /api/claims/user
 * @access  Private (User)
 */
export const getUserClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.user._id })
            .populate('itemId', 'title image status')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: claims.length,
            data: claims
        });
    } catch (error) {
        console.error('Get User Claims Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

/**
 * @desc    Update claim status (Approve/Reject)
 * @route   PUT /api/claims/:id
 * @access  Private (Admin)
 */
export const updateClaimStatus = async (req, res) => {
    try {
        const { status, adminComment } = req.body;
        const claimId = req.params.id;

        // Validate status
        if (!['approved', 'rejected', 'collected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be "approved", "rejected" or "collected"'
            });
        }

        const claim = await Claim.findById(claimId);
        if (!claim) {
            return res.status(404).json({
                success: false,
                message: 'Claim not found'
            });
        }

        // Allow transition from approved to collected
        if (claim.status !== 'pending' && !(claim.status === 'approved' && status === 'collected')) {
            return res.status(400).json({
                success: false,
                message: `Claim is already ${claim.status}`
            });
        }

        // BUSINESS LOGIC: If Approving
        if (status === 'approved') {
            // 1. Check if item is still available
            const item = await Item.findById(claim.itemId);
            if (item.status !== 'available') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot approve. Item is no longer available.'
                });
            }

            // 2. Update Claim Status
            claim.status = 'approved';
            claim.adminComment = adminComment;
            await claim.save();

            // 3. Update Item Status to 'claimed'
            item.status = 'claimed';
            await item.save();

            // Notify User of Approval
            await createNotification(
                claim.userId,
                'Claim Approved!',
                `Your claim for item "${item.title}" has been APPROVED. Please visit the admin desk to collect it.`,
                'success'
            );

            // 4. Reject all OTHER pending claims for this item
            // (Notifications for rejected users could be added here loop-wise if needed, but keeping simple for now)

            await Claim.updateMany(
                {
                    itemId: claim.itemId,
                    _id: { $ne: claimId }, // Not this claim
                    status: 'pending'
                },
                {
                    status: 'rejected',
                    adminComment: 'Item was claimed by another user'
                }
            );

        } else if (status === 'collected') {
            // Just update the claim status
            claim.status = 'collected';
            if (adminComment) claim.adminComment = adminComment;
            await claim.save();

            // Notification handled in item.controller for completion usually, 
            // but if this is called directly we should add one?
            // Rely on Item Controller's markAsCollected for the main logic.

        } else {
            // Just Rejecting
            claim.status = 'rejected';
            claim.adminComment = adminComment;
            await claim.save();

            // Notify User of Rejection
            const rejectionMsg = adminComment ? `Reason: ${adminComment}` : 'Verification failed.';
            await createNotification(
                claim.userId,
                'Claim Rejected',
                `Your claim has been rejected. ${rejectionMsg}`,
                'error'
            );
        }

        res.status(200).json({
            success: true,
            message: `Claim ${status} successfully`,
            data: claim
        });

    } catch (error) {
        console.error('Update Claim Status Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
