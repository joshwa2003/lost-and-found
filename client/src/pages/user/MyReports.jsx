import { useState, useEffect } from 'react';
import { getUserItems } from '../../services/itemService';
import { Link } from 'react-router-dom';

const MyReports = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyItems();
    }, []);

    const fetchMyItems = async () => {
        try {
            const response = await getUserItems();
            if (response.success) {
                setItems(response.items);
            }
        } catch (err) {
            console.error('Error fetching my items:', err);
            setError('Failed to load your reported items.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-emerald-100 text-emerald-700';
            case 'claimed': return 'bg-amber-100 text-amber-700';
            case 'collected': return 'bg-blue-100 text-blue-700';
            default: return 'bg-slate-100 text-slate-700';
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Reports</h1>
                        <p className="text-slate-600">Items you have found and reported</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading your reports...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-center">
                    {error}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Reports Yet</h3>
                    <p className="text-slate-500 mb-6">You haven't reported any found items.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                            <div className="h-48 bg-slate-100 relative">
                                <img
                                    src={`http://localhost:5001/uploads/${item.image}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <span className="mr-2">📍</span>
                                            {item.foundLocation}
                                        </div>
                                        <div className="flex items-center text-sm text-slate-500">
                                            <span className="mr-2">📅</span>
                                            {formatDate(item.foundDate)}
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    to={`/user/item-details/${item._id}`}
                                    className="w-full py-2 bg-slate-50 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors text-center block"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyReports;
