import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserDashboardStats } from '../../services/userService';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useAuth();
    const [greeting, setGreeting] = useState('');
    const [stats, setStats] = useState({
        itemsReported: 0,
        claimsMade: 0,
        claimsApproved: 0
    });
    const [myRecentReports, setMyRecentReports] = useState([]);
    const [recentlyFound, setRecentlyFound] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await getUserDashboardStats();
            if (response.success) {
                setStats(response.stats);
                setMyRecentReports(response.myRecentReports);
                setRecentlyFound(response.recentlyFound);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { title: 'My Reports', value: stats.itemsReported, icon: '📝', color: 'sky' },
        { title: 'Claims Made', value: stats.claimsMade, icon: '🎯', color: 'amber' },
        { title: 'Claims Approved', value: stats.claimsApproved, icon: '✅', color: 'emerald' },
    ];

    const quickActions = [
        { title: 'Browse Items', desc: 'Find your lost items', icon: '🔍', link: '/user/items', color: 'sky' },
        { title: 'Report Item', desc: 'Found something?', icon: '➕', link: '/admin/add-item', color: 'emerald' }, // Assuming users can also add items via admin/add-item or separate route? Checking router, users usually use AddItem too or maybe specific user route. Let's start with Browse and My Reports as safer defaults.
        { title: 'My Reports', desc: 'View your submissions', icon: '📋', link: '/user/my-reports', color: 'slate' },
    ];

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

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
                            Welcome back to your dashboard. Here's what's happening.
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
                    {statCards.map((stat, index) => (
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action, index) => (
                        <Link
                            key={index}
                            to={action.link}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-sky-300 transition-all group block"
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
                        </Link>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Recent Reports */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-900">My Recent Reports</h2>
                        <Link to="/user/my-reports" className="text-sm text-sky-600 hover:text-sky-800 font-medium">View All</Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
                        {myRecentReports.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No reports yet. Found something? Report it!
                            </div>
                        ) : (
                            myRecentReports.map((report) => (
                                <Link key={report._id} to={`/user/item-details/${report._id}`} className="block p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={`http://localhost:5001/uploads/${report.image}`}
                                                alt={report.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-slate-900 truncate">{report.title}</h3>
                                            <p className="text-xs text-slate-500">Posted {formatDate(report.createdAt)}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${report.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                                                report.status === 'claimed' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Recently Found Items (Global) */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Recently Found Items</h2>
                        <Link to="/user/items" className="text-sm text-sky-600 hover:text-sky-800 font-medium">Browse All</Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
                        {recentlyFound.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                No new found items recently.
                            </div>
                        ) : (
                            recentlyFound.map((item) => (
                                <Link key={item._id} to={`/user/item-details/${item._id}`} className="block p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img
                                                src={`http://localhost:5001/uploads/${item.image}`}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/48'}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-slate-900 truncate">{item.title}</h3>
                                            <p className="text-xs text-slate-500">Found {formatDate(item.foundDate)} at {item.foundLocation}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Helpful Tips */}
            <div className="bg-sky-50 rounded-xl border border-sky-200 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">💡 Helpful Tip</h3>
                <p className="text-sm text-slate-700">
                    If you found an item, please report it immediately. If you lost an item, check specifically for matches in your location using our Filter tool.
                </p>
            </div>
        </div>
    );
};

export default UserDashboard;
