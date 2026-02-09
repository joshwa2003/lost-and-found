import api from './api';

// Create a new claim
export const createClaim = async (itemId) => {
    try {
        const response = await api.post('/claims', { itemId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get current user's claims
export const getUserClaims = async () => {
    try {
        const response = await api.get('/claims/user');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
// Get all claims (Admin only)
export const getAllClaims = async () => {
    try {
        const response = await api.get('/claims');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update claim status (Admin only)
export const updateClaimStatus = async (id, status, adminComment) => {
    try {
        const response = await api.put(`/claims/${id}`, { status, adminComment });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
