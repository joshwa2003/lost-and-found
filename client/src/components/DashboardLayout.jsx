import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.role === 'admin';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminNavItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'Add Item', path: '/admin/add-item', icon: '➕' },
        { name: 'Manage Items', path: '/admin/manage-items', icon: '📦' },
    ];

    const userNavItems = [
        { name: 'Dashboard', path: '/user/dashboard', icon: '📊' },
        { name: 'Browse Items', path: '/user/items', icon: '🔍' },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navbar */}
            <header className="fixed top-0 w-full bg-white shadow-md z-50">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to={isAdmin ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">💪</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">Gym Lost & Found</h1>
                                <p className="text-xs text-cyan-600">{isAdmin ? 'Admin Panel' : 'Member Portal'}</p>
                            </div>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-slate-700"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* User Info & Logout */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                                <p className="text-xs text-slate-600">{user?.email || ''}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="flex pt-20">
                {/* Sidebar */}
                <aside className={`fixed md:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-40 w-64 bg-white shadow-lg md:shadow-none border-r border-slate-200 pt-20 md:pt-0`}>
                    <nav className="p-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors font-medium"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}

                        {/* Mobile Logout */}
                        <button
                            onClick={handleLogout}
                            className="md:hidden w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                        >
                            <span className="text-xl">🚪</span>
                            <span>Logout</span>
                        </button>
                    </nav>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                )}

                {/* Main Content */}
                <main className="flex-1 p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
