import React, { useEffect, useState } from 'react';
import { getUserClaims } from '../../services/claimService';
import ClaimStatusBadge from '../../components/ClaimStatusBadge';
import { Link } from 'react-router-dom';

const MyClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const response = await getUserClaims();
            if (response.success) {
                setClaims(response.data);
            }
        } catch (err) {
            console.error('Error fetching claims:', err);
            setError('Failed to load your claims.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Loading claims...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Claims</h1>
                    <p className="text-slate-500 mt-1">Track the status of items you have claimed.</p>
                </div>
                <Link
                    to="/user/items"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                    Browse Items
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
                    {error}
                </div>
            )}

            {claims.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">📭</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Claims Yet</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                        You haven't claimed any lost items yet. Check the "Browse Items" section if you've lost something.
                    </p>
                    <Link
                        to="/user/items"
                        className="px-6 py-3 bg-sky-500 text-white rounded-lg font-bold hover:bg-sky-600 transition-colors inline-block"
                    >
                        Browse Lost Items
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {claims.map((claim) => (
                        <div
                            key={claim._id}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                        >
                            {/* Item Image */}
                            <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-100">
                                {claim.itemId && claim.itemId.image ? (
                                    <img
                                        src={`http://localhost:5001/uploads/${claim.itemId.image}`}
                                        alt={claim.itemId.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                ) : (
                                    <span className="text-2xl">📷</span>
                                )}
                            </div>

                            {/* Claim Details */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {claim.itemId ? claim.itemId.title : 'Unknown Item'}
                                    </h3>
                                    <ClaimStatusBadge status={claim.status} />
                                </div>
                                <div className="text-sm text-slate-500 space-y-1">
                                    <p>Claimed on <span className="font-medium text-slate-700">{formatDate(claim.createdAt)}</span></p>
                                    <p>Item ID: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">{claim.itemId ? claim.itemId._id.slice(-6).toUpperCase() : 'N/A'}</span></p>
                                </div>

                                {/* Admin Comment Section */}
                                {claim.adminComment && (
                                    <div className="mt-4 bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
                                        <p className="font-semibold text-slate-700 mb-1 flex items-center">
                                            <span className="mr-1.5">💬</span> Admin Response:
                                        </p>
                                        <p className="text-slate-600">{claim.adminComment}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action / Arrow */}
                            <div className="hidden md:block">
                                <Link
                                    to={`/user/item-details/${claim.itemId?._id}`}
                                    className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                                >
                                    View Item →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyClaims;
