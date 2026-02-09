import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getItemById } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClaimModal, setShowClaimModal] = useState(false);

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const fetchItemDetails = async () => {
        try {
            setLoading(true);
            const response = await getItemById(id);
            if (response.success) {
                setItem(response.item);
            } else {
                setError('Item not found');
            }
        } catch (err) {
            console.error('Error fetching item details:', err);
            setError('Failed to load item details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = () => {
        // Day 10 Implementation Placeholder
        setShowClaimModal(false);
        alert('Claim functionality coming soon! (Day 10)');
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
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Loading item details...</p>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Item</h2>
                    <p className="text-red-600 mb-6">{error || 'Item not found'}</p>
                    <button
                        onClick={() => navigate('/user/items')}
                        className="px-6 py-3 bg-white border border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                    >
                        ← Back to Items
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Back Button */}
            <button
                onClick={() => navigate('/user/items')}
                className="flex items-center text-slate-600 hover:text-sky-600 font-medium mb-8 group transition-colors"
            >
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                Back to Browse
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Image Section */}
                    <div className="bg-slate-100 relative min-h-[400px] lg:min-h-full flex items-center justify-center p-8 group">
                        {item.image ? (
                            <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                                <img
                                    src={`http://localhost:5001/uploads/${item.image}`}
                                    alt={item.title}
                                    className="max-w-full max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <span className="text-6xl mb-4">📷</span>
                                    <span>Image not available</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-slate-400">
                                <span className="text-6xl mb-4">📷</span>
                                <span>No image provided</span>
                            </div>
                        )}

                        {/* Status Badge Overlay */}
                        <div className="absolute top-6 left-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-sm ${item.status === 'available'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-amber-500 text-white'
                                }`}>
                                {item.status === 'available' ? 'Available' : 'Claimed'}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:p-12 flex flex-col h-full">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 text-sm text-slate-500 mb-3">
                                <span>Item ID:</span>
                                <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">{item._id.slice(-6).toUpperCase()}</span>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                                {item.title}
                            </h1>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">Found Location</p>
                                    <div className="flex items-center text-slate-900 font-semibold">
                                        <span className="mr-2">📍</span>
                                        {item.foundLocation}
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">Date Found</p>
                                    <div className="flex items-center text-slate-900 font-semibold">
                                        <span className="mr-2">📅</span>
                                        {formatDate(item.foundDate)}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Description</h3>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {item.description}
                                </p>
                            </div>

                            {item.status === 'available' && (
                                <div className="bg-sky-50 border border-sky-100 rounded-lg p-5 mb-8">
                                    <h3 className="text-sm font-bold text-sky-900 mb-2 flex items-center">
                                        <span className="mr-2">ℹ️</span> How to Claim
                                    </h3>
                                    <p className="text-sm text-sky-800 leading-relaxed">
                                        Is this your item? Click the button below to start the claim process.
                                        You'll need to verify ownership at the reception desk.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-slate-100 pt-8 mt-auto">
                            {item.status === 'available' ? (
                                <button
                                    onClick={() => setShowClaimModal(true)}
                                    className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
                                >
                                    Claim This Item
                                </button>
                            ) : (
                                <button
                                    disabled
                                    className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center"
                                >
                                    <span className="mr-2">🔒</span> Item Already Claimed
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Claim Modal */}
            {showClaimModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">👋</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Claim Item?</h2>
                            <p className="text-slate-600">
                                You are about to initiate a claim for <strong>{item.title}</strong>.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClaimModal(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClaim}
                                className="flex-1 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors shadow-sm"
                            >
                                Confirm Claim
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemDetails;
