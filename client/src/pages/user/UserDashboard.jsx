import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const stats = [
        { title: 'My Reports', value: '3', icon: '📝', color: 'sky' },
        { title: 'Items Found', value: '8', icon: '✅', color: 'emerald' },
        { title: 'Items Claimed', value: '2', icon: '🎯', color: 'amber' },
    ];

    const quickActions = [
        { title: 'Browse Items', desc: 'Find your lost items', icon: '🔍', link: '/user/items', color: 'sky' },
        { title: 'My Reports', desc: 'View your submissions', icon: '📝', link: '/user/my-reports', color: 'slate' },
    ];

    const myReports = [
        { item: 'Red Gym Bag', location: 'Locker Room', date: 'Feb 8', status: 'available' },
        { item: 'Water Bottle', location: 'Cardio Area', date: 'Feb 6', status: 'available' },
    ];

    const recentlyFound = [
        { item: 'iPhone 13', location: 'Reception', date: 'Today', image: '📱' },
        { item: 'Gym Towel', location: 'Pool Area', date: 'Yesterday', image: '🧺' },
        { item: 'Key Chain', location: 'Parking Lot', date: '2 days ago', image: '🔑' },
    ];

    return (
        <div className="space-y-8">
            {/* Professional Welcome */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            {greeting}, {user?.name}! 👋
                        </h1>
                        <p className="text-slate-600">
                            Welcome back to your dashboard. Check out the latest found items.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center">
                            <span className="text-3xl">👤</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Your Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                                    <span className="text-2xl">{stat.icon}</span>
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                        </div>
                    ))}
                </div>
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

            {/* My Reports */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">My Recent Reports</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
                    {myReports.map((report, index) => (
                        <div key={index} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-slate-900 mb-1">{report.item}</h3>
                                    <div className="flex items-center space-x-4 text-xs text-slate-600">
                                        <span>📍 {report.location}</span>
                                        <span>📅 {report.date}</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recently Found Items */}
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recently Found Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentlyFound.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="w-full h-32 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-5xl">{item.image}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mb-2">{item.item}</h3>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                                <span>📍 {item.location}</span>
                                <span>{item.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Helpful Tips */}
            <div className="bg-sky-50 rounded-xl border border-sky-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">💡 Helpful Tip</h3>
                <p className="text-sm text-slate-700">
                    Check the Browse Items section regularly to see if your lost item has been found.
                    Items are updated in real-time!
                </p>
            </div>
        </div>
    );
};

export default UserDashboard;
