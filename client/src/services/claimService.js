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
