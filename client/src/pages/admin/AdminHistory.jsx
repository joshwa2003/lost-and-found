import React, { useState, useEffect } from 'react';
import { getAllItems } from '../../services/itemService';

const AdminHistory = () => {
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            // Fetch items with status='collected' (which allows archived items)
            const response = await getAllItems({ status: 'collected' });
            if (response.success) {
                setHistoryItems(response.items);
            }
        } catch (err) {
            console.error('Error fetching history:', err);
            setError('Failed to load history records.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading history records...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-slate-900">Collection History</h1>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold border border-slate-200">
                        {historyItems.length} Records
                    </span>
                </div>
                <p className="text-slate-500 mt-2">Archive of all items that have been successfully collected by owners.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {historyItems.length === 0 ? (
                    <div className="p-16 text-center text-slate-500">
                        <div className="text-5xl mb-6 opacity-30">📂</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
                        <p>Items marked as "Collected" will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Found</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Collected</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {historyItems.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                                    {item.image ? (
                                                        <img
                                                            className="h-full w-full object-cover"
                                                            src={`http://localhost:5001/uploads/${item.image}`}
                                                            alt=""
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    ) : (
                                                        <span className="text-xl">📷</span>
                                                    )}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                                    <div className="text-xs text-slate-500 font-mono">ID: {item._id.slice(-6).toUpperCase()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {formatDate(item.foundDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                            {item.collectedDate ? formatDate(item.collectedDate) : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                                <span className="mr-1.5">🤝</span> Collected
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHistory;
