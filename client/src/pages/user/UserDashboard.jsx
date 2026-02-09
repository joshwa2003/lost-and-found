import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [greeting, setGreeting] = useState('');
    const [myReports, setMyReports] = useState([
        {
            id: 1,
            name: 'Black Water Bottle',
            category: 'Water Bottle',
            reportedDate: '2024-02-08',
            status: 'searching'
        },
        {
            id: 2,
            name: 'Red Gym Towel',
            category: 'Towel',
            reportedDate: '2024-02-05',
            status: 'found'
        }
    ]);

    const [userStats] = useState({
        totalReports: 2,
        foundItems: 1,
        claimedItems: 0
    });

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    const recentFound = [
        {
            id: 1,
            name: 'Blue Water Bottle',
            category: 'Water Bottle',
            location: 'Gym Floor',
            foundDate: '2024-02-09',
            image: '💧'
        },
        {
            id: 2,
            name: 'Wireless Earbuds',
            category: 'Earbuds/Headphones',
            location: 'Cardio Area',
            foundDate: '2024-02-08',
            image: '🎧'
        },
        {
            id: 3,
            name: 'Red Gym Bag',
            category: 'Bag/Backpack',
            location: 'Locker Room',
            foundDate: '2024-02-07',
            image: '🎒'
        }
    ];

    const quickActions = [
        {
            title: 'Browse Items',
            desc: 'Search for your lost items',
            icon: '🔍',
            link: '/user/items',
            gradient: 'from-cyan-500 to-blue-500',
            featured: true
        },
        {
            title: 'Report Lost Item',
            desc: 'Tell us what you lost',
            icon: '📝',
            link: '#',
            gradient: 'from-purple-500 to-pink-500',
            featured: false
        },
        {
            title: 'My Reports',
            desc: 'View your report history',
            icon: '📊',
            link: '#',
            gradient: 'from-orange-500 to-amber-500',
            featured: false
        }
    ];

    const getStatusBadge = (status) => {
        if (status === 'found') {
            return <span className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs font-bold shadow-md">Found ✅</span>;
        } else if (status === 'searching') {
            return <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full text-xs font-bold shadow-md">Searching 🔍</span>;
        }
        return <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-bold shadow-md">Claimed</span>;
    };

    return (
        <div className="space-y-8">
            {/* Enhanced Welcome Banner */}
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {greeting}! 👋
                    </h1>
                    <p className="text-cyan-100 text-lg">Check the status of your items and browse recently found items</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                            📝
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{userStats.totalReports}</div>
                        <div className="text-sm font-medium text-slate-600">Total Reports</div>
                    </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                            ✅
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{userStats.foundItems}</div>
                        <div className="text-sm font-medium text-slate-600">Items Found</div>
                    </div>
                </div>

                <div className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                            🎉
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{userStats.claimedItems}</div>
                        <div className="text-sm font-medium text-slate-600">Items Claimed</div>
                    </div>
                </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                    <div className="text-sm text-slate-500">Get started quickly</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className={`group relative rounded-2xl p-6 text-white overflow-hidden ${action.featured ? 'md:col-span-1' : ''} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
                        >
                            {action.featured ? (
                                <>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient}`}></div>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                    <div className="relative z-10">
                                        <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">{action.icon}</div>
                                        <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                                        <p className="text-white/90 text-sm mb-4">{action.desc}</p>
                                        <div className="flex items-center font-semibold">
                                            Get Started
                                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-white border border-slate-200"></div>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>{action.icon}</div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{action.title}</h3>
                                        <p className="text-slate-600 text-sm">{action.desc}</p>
                                    </div>
                                </>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Enhanced My Reports */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">My Reports</h2>
                    <button className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold hover:underline">
                        View All →
                    </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {myReports.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {myReports.map((report) => (
                                <div key={report.id} className="p-6 hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200 group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                                                📦
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">{report.name}</h3>
                                                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                                    <span className="flex items-center font-medium">
                                                        <span className="mr-1.5">🏷️</span>
                                                        {report.category}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center">
                                                        <span className="mr-1.5">📅</span>
                                                        {new Date(report.reportedDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            {getStatusBadge(report.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <p className="text-slate-600 font-medium">No reports yet</p>
                            <p className="text-sm text-slate-500 mt-2">Start by reporting a lost item</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Recently Found Items */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Recently Found Items</h2>
                    <Link to="/user/items" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold hover:underline">
                        View All →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentFound.map((item) => (
                        <div
                            key={item.id}
                            className="group bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    {item.image}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.name}</h3>
                                <div className="space-y-2 text-sm text-slate-600 mb-5">
                                    <p className="flex items-center">
                                        <span className="mr-2 text-base">🏷️</span>
                                        <span className="font-medium">{item.category}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="mr-2 text-base">📍</span>
                                        <span className="font-medium">{item.location}</span>
                                    </p>
                                    <p className="flex items-center">
                                        <span className="mr-2 text-base">📅</span>
                                        <span className="font-medium">{new Date(item.foundDate).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                <Link
                                    to={`/user/item-details/${item.id}`}
                                    className="block text-center px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Tips Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                            💡
                        </div>
                        <h3 className="text-2xl font-bold">Quick Tips</h3>
                    </div>
                    <ul className="space-y-3 text-white/95">
                        <li className="flex items-start">
                            <span className="mr-3 text-xl flex-shrink-0">✨</span>
                            <span>Check "Browse Items" regularly for newly found items</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 text-xl flex-shrink-0">📝</span>
                            <span>Provide detailed descriptions when reporting lost items</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-3 text-xl flex-shrink-0">🆔</span>
                            <span>Bring valid ID when claiming items at the front desk</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
