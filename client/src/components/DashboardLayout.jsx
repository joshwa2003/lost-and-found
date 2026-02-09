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
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊', gradient: 'from-cyan-500 to-blue-500' },
        { name: 'Add Item', path: '/admin/add-item', icon: '➕', gradient: 'from-green-500 to-emerald-500' },
        { name: 'Manage Items', path: '/admin/manage-items', icon: '📦', gradient: 'from-purple-500 to-pink-500' },
    ];

    const userNavItems = [
        { name: 'Dashboard', path: '/user/dashboard', icon: '📊', gradient: 'from-cyan-500 to-blue-500' },
        { name: 'Browse Items', path: '/user/items', icon: '🔍', gradient: 'from-purple-500 to-pink-500' },
        { name: 'My Reports', path: '/user/item-details/1', icon: '📝', gradient: 'from-orange-500 to-amber-500' },
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
            {/* Enhanced Top Navbar */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-lg z-50 border-b border-slate-200">
                <div className="relative overflow-hidden">
                    {/* Gradient accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

                    <nav className="container mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            {/* Enhanced Logo */}
                            <Link
                                to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                                className="flex items-center space-x-3 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl blur-sm group-hover:blur-md transition-all"></div>
                                    <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-bold text-2xl">💪</span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                        Gym Lost & Found
                                    </h1>
                                    <p className="text-xs font-semibold text-cyan-600">
                                        {isAdmin ? '⚡ Admin Panel' : '✨ Member Portal'}
                                    </p>
                                </div>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden relative w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Enhanced User Info & Logout */}
                            <div className="hidden md:flex items-center space-x-4">
                                {/* User Avatar & Info */}
                                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-xl border border-slate-200 shadow-sm">
                                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                                        {getUserInitials()}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
                                        <p className="text-xs text-slate-600">{user?.email || ''}</p>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="group relative px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="relative flex items-center space-x-2">
                                        <span>Logout</span>
                                        <span className="text-lg">🚪</span>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="flex pt-20">
                {/* Enhanced Sidebar */}
                <aside className={`fixed md:static inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-72 bg-white/80 backdrop-blur-md shadow-2xl md:shadow-lg border-r border-slate-200 pt-20 md:pt-0`}>
                    {/* Sidebar Header */}
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-br from-cyan-50 to-blue-50">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {isAdmin ? '👑' : '👤'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    {isAdmin ? 'Admin Portal' : 'Member Portal'}
                                </p>
                                <p className="text-xs text-slate-600">Navigation Menu</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-6 space-y-2">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${active
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg scale-105'
                                            : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-cyan-50 hover:shadow-md hover:scale-102'
                                        }`}
                                >
                                    {/* Active indicator */}
                                    {active && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"></div>
                                    )}

                                    {/* Icon with gradient background */}
                                    <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform duration-300 ${active
                                            ? 'bg-white/20 shadow-lg'
                                            : `bg-gradient-to-br ${item.gradient} text-white shadow-md group-hover:scale-110 group-hover:rotate-6`
                                        }`}>
                                        {active && <div className="absolute inset-0 bg-white/20 rounded-lg"></div>}
                                        <span className={active ? '' : 'group-hover:scale-110 transition-transform'}>{item.icon}</span>
                                    </div>

                                    <span className="flex-1">{item.name}</span>

                                    {/* Arrow indicator */}
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${active ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            );
                        })}

                        {/* Divider */}
                        <div className="py-4">
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                        </div>

                        {/* Mobile User Info */}
                        <div className="md:hidden p-4 bg-gradient-to-br from-slate-50 to-cyan-50 rounded-xl border border-slate-200">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {getUserInitials()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
                                    <p className="text-xs text-slate-600">{user?.email || ''}</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Logout */}
                        <button
                            onClick={handleLogout}
                            className="md:hidden w-full group relative flex items-center space-x-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold hover:from-red-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <div className="relative w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">
                                🚪
                            </div>
                            <span className="relative flex-1 text-left">Logout</span>
                        </button>
                    </nav>
                </aside>

                {/* Enhanced Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gradient-to-br from-slate-900/50 to-cyan-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
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
