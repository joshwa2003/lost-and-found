import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddLostItem from './pages/admin/AddLostItem';
import ManageItems from './pages/admin/ManageItems';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import ViewItems from './pages/user/ViewItems';
import ItemDetails from './pages/user/ItemDetails';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    // Admin Routes - Protected
    {
        path: '/admin',
        element: (
            <ProtectedRoute requiredRole="admin">
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: <AdminDashboard />,
            },
            {
                path: 'add-item',
                element: <AddLostItem />,
            },
            {
                path: 'manage-items',
                element: <ManageItems />,
            },
        ],
    },
    // User Routes - Protected
    {
        path: '/user',
        element: (
            <ProtectedRoute requiredRole="user">
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: 'dashboard',
                element: <UserDashboard />,
            },
            {
                path: 'items',
                element: <ViewItems />,
            },
            {
                path: 'item-details/:id',
                element: <ItemDetails />,
            },
        ],
    },
]);

export default router;
