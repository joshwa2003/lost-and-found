import api from './api';

/**
 * Admin Service - Handles all admin-related API calls
 */

/**
 * Get Dashboard Statistics
 * @returns {Promise} API response containing stats
 */
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
