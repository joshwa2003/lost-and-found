import api from './api';

/**
 * User Service - Handles all user-related API calls
 */

/**
 * Get User Dashboard Statistics
 * @returns {Promise} API response
 */
export const getUserDashboardStats = async () => {
    try {
        const response = await api.get('/users/dashboard-stats');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
