import { useState } from 'react';

const ManageItems = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock data - will be replaced with API call
    const [items, setItems] = useState([
        {
            id: 1,
            name: 'Blue Water Bottle',
            category: 'Water Bottle',
            location: 'Gym Floor',
            foundDate: '2024-02-08',
            status: 'found',
            color: 'Blue'
        },
        {
            id: 2,
            name: 'White Gym Towel',
            category: 'Towel',
            location: 'Locker Room - Men',
            foundDate: '2024-02-07',
            status: 'claimed',
            color: 'White'
        },
        {
            id: 3,
            name: 'Wireless Earbuds',
            category: 'Earbuds/Headphones',
            location: 'Cardio Area',
            foundDate: '2024-02-06',
            status: 'found',
            color: 'Black'
        },
        {
            id: 4,
            name: 'Locker Key #24',
            category: 'Keys',
            location: 'Reception',
            foundDate: '2024-02-05',
            status: 'claimed',
            color: 'Silver'
        },
        {
            id: 5,
            name: 'Red Gym Bag',
            category: 'Bag/Backpack',
            location: 'Locker Room - Women',
            foundDate: '2024-02-04',
            status: 'found',
            color: 'Red'
        }
    ]);

    const filteredItems = items.filter(item => {
        const matchesFilter = filter === 'all' || item.status === filter;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status) => {
        if (status === 'found') {
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Found</span>;
        } else if (status === 'claimed') {
            return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Claimed</span>;
        }
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        Manage Items
                    </h1>
                    <p className="text-slate-600">View and manage all lost & found items</p>
                </div>
                <a
                    href="/admin/add-item"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md"
                >
                    <span className="mr-2">➕</span>
                    Add New Item
                </a>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'all'
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('found')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'found'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Found
                        </button>
                        <button
                            onClick={() => setFilter('claimed')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${filter === 'claimed'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                        >
                            Claimed
                        </button>
                    </div>
                </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                                <p className="text-sm text-slate-600">{item.category}</p>
                            </div>
                            {getStatusBadge(item.status)}
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">📍</span>
                                <span>{item.location}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">📅</span>
                                <span>Found on {new Date(item.foundDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <span className="mr-2">🎨</span>
                                <span>Color: {item.color}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg font-semibold hover:bg-cyan-100 transition-colors">
                                View Details
                            </button>
                            <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                                Edit
                            </button>
                            <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors">
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
                    <p className="text-slate-600">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
};

export default ManageItems;
