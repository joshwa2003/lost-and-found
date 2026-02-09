import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const stats = [
        { title: 'Total Items', value: '42', icon: '📦', trend: '+8 this week', color: 'sky' },
        { title: 'Available', value: '28', icon: '✅', trend: '12 new items', color: 'emerald' },
        { title: 'Claimed', value: '14', icon: '🎯', trend: '6 this month', color: 'amber' },
        { title: 'Total Users', value: '156', icon: '👥', trend: '+12 active', color: 'slate' },
    ];

    const quickActions = [
        { title: 'Add New Item', desc: 'Register a found item', icon: '➕', link: '/admin/add-item', color: 'sky' },
        { title: 'Manage Items', desc: 'View and edit items', icon: '📦', link: '/admin/manage-items', color: 'slate' },
    ];

    const recentActivity = [
        { action: 'New item added', item: 'Blue Water Bottle', time: '5 mins ago', icon: '➕' },
        { action: 'Item claimed', item: 'Gym Bag', time: '1 hour ago', icon: '🎯' },
        { action: 'New user registered', item: 'John Doe', time: '2 hours ago', icon: '👤' },
    ];

    return (
        <div className="space-y-8">
            {/* Professional Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {greeting}, {user?.name}! 👋
                        </h1>
                        <p className="text-slate-600">
                            Welcome to your admin dashboard. Here's what's happening today.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center">
                            <span className="text-3xl">👨‍💼</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                                <span className="text-2xl">{stat.icon}</span>
                            </div>
                            <p className="text-xs text-slate-500">{stat.trend}</p>
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickActions.map((action, index) => (
                        <a
                            key={index}
                            href={action.link}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-sky-300 transition-all group"
                        >
                            <div className="flex items-start space-x-4">
                                <div className={`w-14 h-14 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <span className="text-2xl">{action.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-sky-600 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-slate-600">{action.desc}</p>
                                </div>
                                <span className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all">
                                    →
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg">{activity.icon}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                                    <p className="text-sm text-slate-600">{activity.item}</p>
                                </div>
                                <p className="text-xs text-slate-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
