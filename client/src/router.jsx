import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddItem from './pages/admin/AddItem';
import ManageItems from './pages/admin/ManageItems';
import AdminClaims from './pages/admin/AdminClaims';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import ViewItems from './pages/user/ViewItems';
import ItemDetails from './pages/user/ItemDetails';
import MyClaims from './pages/user/MyClaims';

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
                element: <AddItem />,
            },
            {
                path: 'manage-items',
                element: <ManageItems />,
            },
            {
                path: 'claims',
                element: <AdminClaims />,
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
            {
                path: 'my-claims',
                element: <MyClaims />,
            },
        ],
    },
]);

export default router;
