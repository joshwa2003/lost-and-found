import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = authService.getCurrentUser();
        const storedToken = authService.getToken();

        if (storedUser && storedToken) {
            setUser(storedUser);
            setToken(storedToken);
        }

        setLoading(false);
    }, []);

    // Login function
    const login = async (email, password) => {
        const result = await authService.login(email, password);

        if (result.success) {
            setUser(result.user);
            setToken(result.token);
            return { success: true, user: result.user };
        }

        return { success: false, message: result.message };
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        authService.logout();
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!(user && token);
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return user && user.role === role;
    };

    // Get user role
    const getUserRole = () => {
        return user?.role || null;
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        hasRole,
        getUserRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
