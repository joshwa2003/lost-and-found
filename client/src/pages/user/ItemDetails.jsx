import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getItemById } from '../../services/itemService';
import { getUserClaims } from '../../services/claimService';
import { useAuth } from '../../context/AuthContext';
import ClaimForm from '../../components/ClaimForm';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, getUserRole } = useAuth();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [userClaimStatus, setUserClaimStatus] = useState(null); // 'pending', 'approved', 'rejected', or null
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch item details
            const itemResponse = await getItemById(id);

            if (itemResponse.success) {
                setItem(itemResponse.item);

                // Check if user has already claimed this item
                try {
                    const claimsResponse = await getUserClaims();
                    const myClaim = claimsResponse.data.find(c => c.itemId._id === id || c.itemId === id);
                    if (myClaim) {
                        setUserClaimStatus(myClaim.status);
                    }
                } catch (err) {
                    console.error('Error checking user claims:', err);
                }
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

    const handleClaimSuccess = () => {
        setShowClaimModal(false);
        setSuccessMessage('Claim submitted successfully! Check "My Claims" for updates.');
        setUserClaimStatus('pending'); // Optimistically update status

        // Clear success message after 5 seconds
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
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

    // Determine Button State
    const renderActionButton = () => {
        if (getUserRole() === 'admin') {
            return (
                <button
                    disabled
                    className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-bold text-lg cursor-default flex items-center justify-center border border-slate-200"
                >
                    <span className="mr-2">🛡️</span> Admin View Only
                </button>
            );
        }

        // 1. If user already claimed it
        if (userClaimStatus) {
            const statusConfig = {
                pending: { text: 'Claim Pending', icon: '⏳', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
                approved: { text: 'Claim Approved', icon: '✅', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
                rejected: { text: 'Claim Rejected', icon: '❌', bg: 'bg-red-100 text-red-800 border-red-200' }
            };
            const config = statusConfig[userClaimStatus] || statusConfig.pending;

            return (
                <button
                    disabled
                    className={`w-full py-4 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center border ${config.bg}`}
                >
                    <span className="mr-2">{config.icon}</span> {config.text}
                </button>
            );
        }

        // 2. If item is unavailable (claimed by someone else)
        if (item.status !== 'available') {
            return (
                <button
                    disabled
                    className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold text-lg cursor-not-allowed flex items-center justify-center"
                >
                    <span className="mr-2">🔒</span> Item Already Claimed
                </button>
            );
        }

        // 3. Available to claim
        return (
            <button
                onClick={() => setShowClaimModal(true)}
                className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
            >
                Claim This Item
            </button>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl shadow-lg flex items-center">
                        <span className="text-2xl mr-3">🎉</span>
                        <div>
                            <h4 className="font-bold">Success!</h4>
                            <p className="text-sm">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

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

                            {item.status === 'available' && !userClaimStatus && (
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
                            {renderActionButton()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Claim Modal */}
            {showClaimModal && (
                <ClaimForm
                    itemId={item._id}
                    itemTitle={item.title}
                    onClose={() => setShowClaimModal(false)}
                    onSuccess={handleClaimSuccess}
                />
            )}
        </div>
    );
};

export default ItemDetails;
