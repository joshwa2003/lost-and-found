import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
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
        { name: 'Manage Claims', path: '/admin/claims', icon: '📝' },
    ];

    const userNavItems = [
        { name: 'Dashboard', path: '/user/dashboard', icon: '📊' },
        { name: 'Browse Items', path: '/user/items', icon: '🔍' },
        { name: 'My Claims', path: '/user/my-claims', icon: '🙋' },
        { name: 'My Reports', path: '/user/my-reports', icon: '📝' },
    ];

    const navItems = isAdmin ? adminNavItems : userNavItems;

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) {
            return names[0][0] + names[1][0];
        }
        return names[0][0];
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Professional Top Navbar */}
            <header className="fixed top-0 w-full bg-white shadow-sm z-50 border-b border-slate-200">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Clean Logo */}
                        <Link
                            to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                            className="flex items-center space-x-3 group"
                        >
                            <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:bg-sky-600 transition-colors">
                                G
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">
                                    Gym Lost & Found
                                </h1>
                                <p className="text-xs text-slate-500 font-medium">
                                    {isAdmin ? '⚡ Admin Portal' : '✨ Member Portal'}
                                </p>
                            </div>
                        </Link>

                        {/* Desktop User Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* User Info */}
                            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-lg">
                                <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="md:hidden p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {sidebarOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Professional Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 border-r border-slate-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0`}
            >
                <div className="flex flex-col h-full pt-24">
                    {/* Sidebar Header */}
                    <div className="px-6 pb-6 border-b border-slate-200">
                        <div className="bg-slate-50 rounded-lg p-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Navigation Menu
                            </p>
                            <p className="text-sm text-slate-600">
                                {isAdmin ? 'Admin Controls' : 'Member Dashboard'}
                            </p>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                                    ? 'bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-500'
                                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile User Info */}
                    <div className="md:hidden border-t border-slate-200 p-6 space-y-3">
                        <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg">
                            <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold">
                                {getUserInitials()}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="md:ml-72 pt-24 min-h-screen">
                <div className="container mx-auto px-6 py-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
