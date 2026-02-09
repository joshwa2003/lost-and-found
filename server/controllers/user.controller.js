import Item from '../models/item.model.js';
import Claim from '../models/claim.model.js';

/**
 * @desc    Get user dashboard statistics
 * @route   GET /api/users/dashboard-stats
 * @access  Private
 */
export const getUserDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Fetch Counts
        const itemsReported = await Item.countDocuments({ postedBy: userId });
        const claimsMade = await Claim.countDocuments({ userId });
        const claimsApproved = await Claim.countDocuments({ userId, status: 'approved' });

        // 2. Fetch My Recent Reports (Limit 3)
        const myRecentReports = await Item.find({ postedBy: userId })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('title foundLocation foundDate status image createdAt');

        // 3. Fetch Recently Found Items (Global - Limit 3)
        // Show items found by others that are available
        const recentlyFound = await Item.find({
            status: 'available',
            postedBy: { $ne: userId } // Exclude own items
        })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('title foundLocation foundDate image createdAt postedBy')
            .populate('postedBy', 'name');

        res.status(200).json({
            success: true,
            stats: {
                itemsReported,
                claimsMade,
                claimsApproved
            },
            myRecentReports,
            recentlyFound
        });

    } catch (error) {
        console.error('User Dashboard Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error: Unable to fetch dashboard stats'
        });
    }
};
