import api from './api';

/**
 * Get user notifications
 */
export const getNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Mark notification as read
 * @param {string} id - Notification ID or 'all'
 */
export const markAsRead = async (id) => {
    try {
        const response = await api.put(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Delete notification
 * @param {string} id - Notification ID
 */
export const deleteNotification = async (id) => {
    try {
        const response = await api.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
