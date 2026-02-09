import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    // Show loader while checking authentication
    if (loading) {
        return <Loader />;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (requiredRole && !hasRole(requiredRole)) {
        // Redirect to appropriate dashboard based on current user role
        const { getUserRole } = useAuth();
        const userRole = getUserRole();

        if (userRole === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (userRole === 'user') {
            return <Navigate to="/user/dashboard" replace />;
        }

        // Fallback to login if role is unknown
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
