import { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalItems: 45,
        foundItems: 28,
        claimedItems: 17,
        pendingItems: 11
    });

    const quickActions = [
        {
            title: 'Add New Item',
            desc: 'Register a found item',
            icon: '➕',
            link: '/admin/add-item',
            color: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Manage Items',
            desc: 'View all items',
            icon: '📦',
            link: '/admin/manage-items',
            color: 'from-cyan-500 to-blue-500'
        },
        {
            title: 'Reports',
            desc: 'View analytics',
            icon: '📊',
            link: '#',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Settings',
            desc: 'System settings',
            icon: '⚙️',
            link: '#',
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-slate-600">Manage lost and found items for the gym</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">📊</span>
                        <span className="text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">TOTAL</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.totalItems}</div>
                    <div className="text-sm text-slate-600">Total Items</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">🔍</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">FOUND</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.foundItems}</div>
                    <div className="text-sm text-slate-600">Found Items</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">✅</span>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">CLAIMED</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.claimedItems}</div>
                    <div className="text-sm text-slate-600">Claimed Items</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">⏳</span>
                        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded">PENDING</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stats.pendingItems}</div>
                    <div className="text-sm text-slate-600">Pending Claims</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, index) => (
                        <a
                            key={index}
                            href={action.link}
                            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all group"
                        >
                            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">{action.title}</h3>
                            <p className="text-sm text-slate-600">{action.desc}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="divide-y divide-slate-200">
                        {[
                            { item: 'Water Bottle - Blue', action: 'Added', time: '2 hours ago', status: 'found' },
                            { item: 'Gym Towel - White', action: 'Claimed', time: '5 hours ago', status: 'claimed' },
                            { item: 'Wireless Earbuds', action: 'Added', time: '1 day ago', status: 'found' },
                            { item: 'Locker Key #24', action: 'Claimed', time: '2 days ago', status: 'claimed' },
                        ].map((activity, index) => (
                            <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.status === 'found' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                            <span className="text-lg">{activity.status === 'found' ? '🔍' : '✅'}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{activity.item}</p>
                                            <p className="text-sm text-slate-600">{activity.action} • {activity.time}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${activity.status === 'found' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {activity.status}
                                    </span>
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
