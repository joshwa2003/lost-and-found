import Item from '../models/item.model.js';
import Claim from '../models/claim.model.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Fetch Item Counts
        const totalItems = await Item.countDocuments();
        const availableItems = await Item.countDocuments({ status: 'available' });
        const claimedItems = await Item.countDocuments({ status: 'claimed' });
        const collectedItems = await Item.countDocuments({ status: 'collected' });

        // 2. Fetch Claim Counts
        const totalClaims = await Claim.countDocuments();
        const pendingClaims = await Claim.countDocuments({ status: 'pending' });
        const approvedClaims = await Claim.countDocuments({ status: 'approved' });
        const rejectedClaims = await Claim.countDocuments({ status: 'rejected' });

        // 3. Fetch Recent Activities (Last 5 items and Last 5 claims)
        const recentItems = await Item.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title status createdAt image')
            .populate('postedBy', 'name');

        const recentClaims = await Claim.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('itemId', 'title image')
            .populate('userId', 'name email');

        // 4. Combine into a response object
        const stats = {
            items: {
                total: totalItems,
                available: availableItems,
                claimed: claimedItems,
                collected: collectedItems
            },
            claims: {
                total: totalClaims,
                pending: pendingClaims,
                approved: approvedClaims,
                rejected: rejectedClaims
            },
            recentActivity: {
                items: recentItems,
                claims: recentClaims
            }
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch dashboard statistics'
        });
    }
};
