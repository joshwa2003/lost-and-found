import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItems } from '../../services/itemService';
import AdvancedSearchBar from '../../components/search/AdvancedSearchBar';
import FilterPanel from '../../components/search/FilterPanel';
import SortDropdown from '../../components/search/SortDropdown';

const ViewItems = () => {
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Search & Filter State
    const [filters, setFilters] = useState({
        search: '',
        location: 'all',
        date: '',
        sort: 'recent'
    });

    // Store all unique locations for the filter dropdown
    const [availableLocations, setAvailableLocations] = useState([]);

    // Initial load to get locations and initial items
    useEffect(() => {
        fetchItems(true);
    }, []);

    // Fetch when filters change
    useEffect(() => {
        fetchItems(false);
    }, [filters]);

    const fetchItems = async (isInitial = false) => {
        try {
            setLoading(true);
            const params = {
                status: 'available',
                ...filters
            };

            // Cleanup params
            if (params.location === 'all') delete params.location;
            if (!params.search) delete params.search;
            if (!params.date) delete params.date;

            const response = await getAllItems(params);

            if (response.success) {
                setItems(response.items);

                // If initial load, extract locations
                if (isInitial) {
                    const locations = [...new Set(response.items.map(item => item.foundLocation))];
                    setAvailableLocations(locations);
                }
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Failed to load items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        setFilters(prev => ({ ...prev, search: query }));
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleSortChange = (sortValue) => {
        setFilters(prev => ({ ...prev, sort: sortValue }));
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            location: 'all',
            date: '',
            sort: 'recent'
        });
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
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Search - Spans 2 cols on large screens */}
                    <div className="lg:col-span-4 xl:col-span-2">
                        <AdvancedSearchBar onSearch={handleSearch} initialValue={filters.search} />
                    </div>

                    {/* Sort Dropdown */}
                    <div className="lg:col-span-2 xl:col-span-1 flex items-center">
                        <SortDropdown value={filters.sort} onChange={handleSortChange} />
                    </div>
                </div>

                {/* divider */}
                <hr className="my-6 border-slate-100" />

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <FilterPanel
                            filters={{ location: filters.location, date: filters.date }}
                            onFilterChange={handleFilterChange}
                            locations={availableLocations}
                        />
                    </div>
                    <div className="flex items-end justify-end">
                        {(filters.search || filters.location !== 'all' || filters.date) && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                {!loading && (
                    <div className="mt-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
                        Found <span className="font-bold text-slate-900">{items.length}</span> results
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
                    <p className="text-lg font-semibold text-slate-700">Searching inventory...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Items</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => fetchItems(false)}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : items.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-16 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                        No matches found
                    </h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                        We couldn't find any items matching your current filters. Try adjusting your search terms or clearing some filters.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                            onClick={() => navigate(`/user/item-details/${item._id}`)}
                        >
                            {/* Item Image */}
                            <div className="relative h-56 bg-slate-100 overflow-hidden">
                                <img
                                    src={`http://localhost:5001/uploads/${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23E2E8F0" width="200" height="200"/%3E%3Ctext fill="%2394A3B8" font-family="Arial" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                                        Available
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white text-sm font-medium">Click to view details</p>
                                </div>
                            </div>

                            {/* Item Details */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-sky-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                                        {item.description}
                                    </p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <span className="mr-2">📍</span>
                                            <span className="font-medium text-slate-700">{item.foundLocation}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500">
                                            <span className="mr-2">📅</span>
                                            <span>{formatDate(item.foundDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-2.5 bg-slate-50 text-sky-600 border border-slate-200 rounded-lg font-semibold hover:bg-sky-50 hover:border-sky-200 transition-all flex items-center justify-center gap-2 group-hover:bg-sky-500 group-hover:text-white group-hover:border-transparent">
                                    <span>View Details</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
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
