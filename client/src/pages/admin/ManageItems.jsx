import { useState, useEffect } from 'react';
import { getAllItems, deleteItem } from '../../services/itemService';
import { Link } from 'react-router-dom';

const ManageItems = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItems();
    }, [filter]); // Re-fetch when filter changes

    const fetchItems = async () => {
        try {
            setLoading(true);
            // Map UI filter to API status
            let apiStatus = filter;
            if (filter === 'found') apiStatus = 'available';

            const params = {
                status: apiStatus,
                search: searchTerm
            };

            // If searching, we might want to search across all statuses if filter is 'all'
            // But the API handles status + search combo correctly.

            const response = await getAllItems(params);
            if (response.success) {
                setItems(response.items);
            }
        } catch (err) {
            console.error('Error fetching items:', err);
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    // Handle search on enter key or with a delay (debounce)
    // For simplicity, let's add a Search button or just use onBlur/Enter
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchItems();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await deleteItem(id);
                if (response.success) {
                    // Refresh list
                    fetchItems();
                }
            } catch (err) {
                console.error('Error deleting item:', err);
                alert('Failed to delete item');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'available':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Found (Available)</span>;
            case 'claimed':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Claimed</span>;
            case 'collected':
                return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">Collected</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                <Link
                    to="/admin/add-item"
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-md"
                >
                    <span className="mr-2">➕</span>
                    Add New Item
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="Search items by title, desc, or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${filter === 'all'
                                ? 'bg-white text-cyan-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('found')}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${filter === 'found'
                                ? 'bg-white text-green-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Found
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('claimed')}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${filter === 'claimed'
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Claimed
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter('collected')}
                            className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${filter === 'collected'
                                ? 'bg-white text-slate-700 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            Collected
                        </button>
                    </div>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading items...</p>
                </div>
            ) : items.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No items found</h3>
                    <p className="text-slate-600">Try adjusting your search or filters</p>
                </div>
            ) : (
                /* Items Grid */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
                        >
                            {/* Image */}
                            <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={`http://localhost:5001/uploads/${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = 'https://placehold.co/150?text=No+Image';
                                    }}
                                />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{item.title}</h3>
                                    {getStatusBadge(item.status)}
                                </div>
                                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>

                                <div className="space-y-1 mb-4">
                                    <div className="flex items-center text-sm text-slate-600">
                                        <span className="mr-2 w-4">📍</span>
                                        <span>{item.foundLocation}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-600">
                                        <span className="mr-2 w-4">📅</span>
                                        <span>Found on {formatDate(item.foundDate)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/item-details/${item._id}`}
                                        className="flex-1 px-3 py-2 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-semibold hover:bg-cyan-100 transition-colors text-center"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        to={`/admin/edit-item/${item._id}`}
                                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors text-center"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageItems;
