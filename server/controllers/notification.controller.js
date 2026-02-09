import Notification from '../models/notification.model.js';

/**
 * @desc    Create a notification (Internal helper)
 * @param   {string} userId - User ID
 * @param   {string} title - Title
 * @param   {string} message - Message
 * @param   {string} type - Type (info, success, warning, error)
 */
export const createNotification = async (userId, title, message, type = 'info') => {
    try {
        await Notification.create({
            userId,
            title,
            message,
            type
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = async (req, res) => {
    try {
        // If ID is 'all', mark all as read
        if (req.params.id === 'all') {
            await Notification.updateMany(
                { userId: req.user._id, isRead: false },
                { isRead: true }
            );
            return res.status(200).json({
                success: true,
                message: 'All notifications marked as read'
            });
        }

        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        await notification.remove();

        res.status(200).json({
            success: true,
            message: 'Notification removed'
        });
    } catch (error) {
        // If remove() is deprecated in newer mongoose versions or fails
        if (error.message.includes('remove is not a function')) {
            await Notification.deleteOne({ _id: req.params.id, userId: req.user._id });
            return res.status(200).json({
                success: true,
                message: 'Notification removed'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
