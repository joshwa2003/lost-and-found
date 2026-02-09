import { useState } from 'react';

const UserDashboard = () => {
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

    const recentFound = [
        {
            id: 1,
            name: 'Blue Water Bottle',
            category: 'Water Bottle',
            location: 'Gym Floor',
            foundDate: '2024-02-09'
        },
        {
            id: 2,
            name: 'Wireless Earbuds',
            category: 'Earbuds/Headphones',
            location: 'Cardio Area',
            foundDate: '2024-02-08'
        },
        {
            id: 3,
            name: 'Red Gym Bag',
            category: 'Bag/Backpack',
            location: 'Locker Room',
            foundDate: '2024-02-07'
        }
    ];

    const getStatusBadge = (status) => {
        if (status === 'found') {
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Found ✅</span>;
        } else if (status === 'searching') {
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Searching 🔍</span>;
        }
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Claimed</span>;
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    Welcome Back! 👋
                </h1>
                <p className="text-slate-600">Check the status of your items and browse recently found items</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <a
                    href="/user/items"
                    className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-6 text-white hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl group"
                >
                    <div className="text-4xl mb-3">🔍</div>
                    <h3 className="text-xl font-bold mb-1">Browse Items</h3>
                    <p className="text-cyan-100 text-sm">Search for your lost items</p>
                </a>

                <a
                    href="#"
                    className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all group"
                >
                    <div className="text-4xl mb-3">📝</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">Report Lost Item</h3>
                    <p className="text-slate-600 text-sm">Tell us what you lost</p>
                </a>

                <a
                    href="#"
                    className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all group"
                >
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">My Reports</h3>
                    <p className="text-slate-600 text-sm">View your report history</p>
                </a>
            </div>

            {/* My Reports */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">My Reports</h2>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {myReports.length > 0 ? (
                        <div className="divide-y divide-slate-200">
                            {myReports.map((report) => (
                                <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">{report.name}</h3>
                                            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                <span className="flex items-center">
                                                    <span className="mr-1">📦</span>
                                                    {report.category}
                                                </span>
                                                <span className="flex items-center">
                                                    <span className="mr-1">📅</span>
                                                    Reported {new Date(report.reportedDate).toLocaleDateString()}
                                                </span>
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
                            <div className="text-5xl mb-3">📭</div>
                            <p className="text-slate-600">No reports yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recently Found Items */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">Recently Found Items</h2>
                    <a href="/user/items" className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
                        View All →
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recentFound.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
                        >
                            <div className="text-3xl mb-3">📦</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{item.name}</h3>
                            <div className="space-y-1 text-sm text-slate-600 mb-4">
                                <p className="flex items-center">
                                    <span className="mr-2">🏷️</span>
                                    {item.category}
                                </p>
                                <p className="flex items-center">
                                    <span className="mr-2">📍</span>
                                    {item.location}
                                </p>
                                <p className="flex items-center">
                                    <span className="mr-2">📅</span>
                                    {new Date(item.foundDate).toLocaleDateString()}
                                </p>
                            </div>
                            <a
                                href={`/user/item-details/${item.id}`}
                                className="block text-center px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-100 transition-colors"
                            >
                                View Details
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-3">💡 Quick Tips</h3>
                <ul className="space-y-2 text-cyan-50">
                    <li>• Check the "Browse Items" section regularly for newly found items</li>
                    <li>• Provide detailed descriptions when reporting lost items</li>
                    <li>• Bring valid ID when claiming items at the front desk</li>
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;
