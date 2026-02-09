import api from './api';

const authService = {
    // Register function
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);

            const { token, user } = response.data;

            // Store token and user data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user, token };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            return { success: false, message: errorMessage };
        }
    },

    // Login function
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });

            const { token, user } = response.data;

            // Store token and user data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            return { success: true, user, token };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            return { success: false, message: errorMessage };
        }
    },

    // Logout function
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch (error) {
                return null;
            }
        }
        return null;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return !!(token && user);
    },

    // Check if user has specific role
    hasRole: (role) => {
        const user = authService.getCurrentUser();
        return user && user.role === role;
    },
};

export default authService;
