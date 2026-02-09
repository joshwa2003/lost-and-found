import api from './api';

/**
 * Item Service - Handles all item-related API calls
 */

/**
 * Add a new item with image upload
 * @param {FormData} formData - Form data containing item details and image
 * @returns {Promise} API response
 */
export const addItem = async (formData) => {
    try {
        const response = await api.post('/items', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Get all items
 * @param {Object} params - Query parameters (search, status)
 * @returns {Promise} API response
 */
export const getAllItems = async (params = {}) => {
    try {
        const response = await api.get('/items', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Get single item by ID
 * @param {string} id - Item ID
 * @returns {Promise} API response
 */
export const getItemById = async (id) => {
    try {
        const response = await api.get(`/items/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Delete item (Admin only)
 * @param {string} id - Item ID
 * @returns {Promise} API response
 */
export const deleteItem = async (id) => {
    try {
        const response = await api.delete(`/items/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Update item status (Admin only)
 * @param {string} id - Item ID  
 * @param {string} status - New status (available/claimed)
 * @returns {Promise} API response
 */
export const updateItemStatus = async (id, status) => {
    try {
        const response = await api.put(`/items/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Mark item as collected (archive) - Admin only
 * @param {string} id - Item ID
 * @param {string} userId - ID of user who collected it
 * @returns {Promise} API response
 */
export const markItemCollected = async (id, userId) => {
    try {
        const response = await api.put(`/items/${id}/complete`, { collectedBy: userId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Get logged-in user's posted items
 * @returns {Promise} API response
 */
export const getUserItems = async () => {
    try {
        const response = await api.get('/items/user/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

/**
 * Update item details (Admin only)
 * @param {string} id - Item ID
 * @param {FormData} formData - Updated item data
 * @returns {Promise} API response
 */
export const updateItem = async (id, formData) => {
    try {
        const response = await api.put(`/items/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
