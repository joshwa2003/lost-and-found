import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState({
        totalItems: 45,
        foundItems: 28,
        claimedItems: 17,
        pendingItems: 11
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const statCards = [
        {
            title: 'Total Items',
            value: stats.totalItems,
            icon: '📊',
            trend: '+12%',
            trendUp: true,
            gradient: 'from-cyan-500 to-blue-500',
            bgGradient: 'from-cyan-50 to-blue-50',
            iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600'
        },
        {
            title: 'Found Items',
            value: stats.foundItems,
            icon: '🔍',
            trend: '+8%',
            trendUp: true,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
            iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600'
        },
        {
            title: 'Claimed Items',
            value: stats.claimedItems,
            icon: '✅',
            trend: '+15%',
            trendUp: true,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
            iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600'
        },
        {
            title: 'Pending Claims',
            value: stats.pendingItems,
            icon: '⏳',
            trend: '-3%',
            trendUp: false,
            gradient: 'from-orange-500 to-amber-500',
            bgGradient: 'from-orange-50 to-amber-50',
            iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600'
        }
    ];

    const quickActions = [
        {
            title: 'Add New Item',
            desc: 'Register a found item',
            icon: '➕',
            link: '/admin/add-item',
            gradient: 'from-green-500 to-emerald-500',
            hoverShadow: 'hover:shadow-green-200'
        },
        {
            title: 'Manage Items',
            desc: 'View all items',
            icon: '📦',
            link: '/admin/manage-items',
            gradient: 'from-cyan-500 to-blue-500',
            hoverShadow: 'hover:shadow-cyan-200'
        },
        {
            title: 'Reports',
            desc: 'View analytics',
            icon: '📊',
            link: '#',
            gradient: 'from-purple-500 to-pink-500',
            hoverShadow: 'hover:shadow-purple-200'
        },
        {
            title: 'Settings',
            desc: 'System settings',
            icon: '⚙️',
            link: '#',
            gradient: 'from-orange-500 to-red-500',
            hoverShadow: 'hover:shadow-orange-200'
        }
    ];

    const recentActivity = [
        { item: 'Water Bottle - Blue', action: 'Added', time: '2 hours ago', status: 'found', user: 'Admin' },
        { item: 'Gym Towel - White', action: 'Claimed', time: '5 hours ago', status: 'claimed', user: 'John Doe' },
        { item: 'Wireless Earbuds', action: 'Added', time: '1 day ago', status: 'found', user: 'Admin' },
        { item: 'Locker Key #24', action: 'Claimed', time: '2 days ago', status: 'claimed', user: 'Jane Smith' },
        { item: 'Yoga Mat - Purple', action: 'Added', time: '3 days ago', status: 'found', user: 'Admin' }
    ];

    return (
        <div className="space-y-8">
            {/* Enhanced Header with Greeting */}
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {greeting}, Admin! 👋
                    </h1>
                    <p className="text-cyan-100 text-lg">Here's what's happening with lost & found items today</p>
                </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                        <div className="relative z-10">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 ${stat.iconBg} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.icon}
                                </div>
                                <div className={`flex items-center space-x-1 text-sm font-bold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{stat.trendUp ? '↑' : '↓'}</span>
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-slate-600">{stat.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Enhanced Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                    <div className="text-sm text-slate-500">Choose an action below</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className={`group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-2xl ${action.hoverShadow} hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                            <div className="relative z-10">
                                <div className={`w-16 h-16 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                    {action.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-300">
                                    {action.title}
                                </h3>
                                <p className="text-sm text-slate-600">{action.desc}</p>
                                <div className="mt-4 flex items-center text-cyan-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Get Started
                                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Enhanced Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
                    <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold hover:underline">
                        View All →
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="p-5 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 flex-1">
                                        <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${activity.status === 'found' ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-blue-100 to-cyan-100'} group-hover:scale-110 transition-transform duration-200`}>
                                            <span className="text-xl">{activity.status === 'found' ? '🔍' : '✅'}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 mb-1">{activity.item}</p>
                                            <div className="flex items-center space-x-2 text-sm text-slate-500">
                                                <span className="font-medium">{activity.action}</span>
                                                <span>•</span>
                                                <span>{activity.time}</span>
                                                <span>•</span>
                                                <span className="text-slate-600">{activity.user}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${activity.status === 'found' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {activity.status === 'found' ? 'FOUND' : 'CLAIMED'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
