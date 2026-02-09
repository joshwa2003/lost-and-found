import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItems } from '../../services/itemService';

const ViewItems = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedLocation, setSelectedLocation] = useState('all');

    useEffect(() => {
        fetchItems();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [items, searchQuery, sortBy, selectedLocation]);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await getAllItems({ status: 'available' });

            if (response.success) {
                setItems(response.items);
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Failed to load items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...items];

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.foundLocation.toLowerCase().includes(query)
            );
        }

        if (selectedLocation !== 'all') {
            filtered = filtered.filter(item =>
                item.foundLocation === selectedLocation
            );
        }

        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }

        setFilteredItems(filtered);
    };

    const getUniqueLocations = () => {
        const locations = items.map(item => item.foundLocation);
        return [...new Set(locations)];
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Professional Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Lost & Found Items
                </h1>
                <p className="text-slate-600">Browse available items and find what you're looking for</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search Bar */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Search Items
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, description, or location..."
                                className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                                🔍
                            </span>
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <span className="text-xl">✕</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                        >
                            <option value="recent">Recently Added</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {/* Location Filter */}
                    {items.length > 0 && (
                        <div className="lg:col-span-1">
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                                Filter by Location
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                            >
                                <option value="all">All Locations</option>
                                {getUniqueLocations().map((location, index) => (
                                    <option key={index} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="mt-4 text-sm text-slate-600">
                        Showing <span className="font-semibold text-sky-600">{filteredItems.length}</span> of {items.length} items
                    </div>
                )}
            </div>

            {/* Items Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative w-20 h-20 mb-4">
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-lg font-semibold text-slate-700">Loading items...</p>
                    <p className="text-sm text-slate-500">Please wait</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Items</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchItems}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        {searchQuery || selectedLocation !== 'all' ? 'No items found' : 'No items available'}
                    </h3>
                    <p className="text-slate-600 mb-4">
                        {searchQuery || selectedLocation !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'Check back later for new items'
                        }
                    </p>
                    {(searchQuery || selectedLocation !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedLocation('all');
                            }}
                            className="px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            onClick={() => navigate(`/user/item-details/${item._id}`)}
                        >
                            {/* Item Image */}
                            <div className="relative h-48 bg-slate-100 overflow-hidden">
                                <img
                                    src={`http://localhost:5001/uploads/${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23E2E8F0" width="200" height="200"/%3E%3Ctext fill="%2394A3B8" font-family="Arial" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full shadow-sm">
                                        Available
                                    </span>
                                </div>
                            </div>

                            {/* Item Details */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                                    {item.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-slate-500">
                                        <span className="mr-2">📍</span>
                                        <span className="font-medium">{item.foundLocation}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <span className="mr-2">📅</span>
                                        <span>{formatDate(item.foundDate)}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewItems;
