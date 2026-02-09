import React, { useState } from 'react';
import { createClaim } from '../services/claimService';

const ClaimForm = ({ itemId, itemTitle, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            await createClaim(itemId);
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to submit claim. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all scale-100">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">👋</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Claim Item?</h2>
                    <p className="text-slate-600">
                        You are about to initiate a claim for <strong className="text-slate-900">{itemTitle}</strong>.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-start">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8 text-sm text-slate-500">
                    <p className="font-semibold text-slate-700 mb-1">Note:</p>
                    <p>By claiming this item, you confirm that it belongs to you. You will need to verify ownership at the reception desk to collect it.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Sending...
                            </>
                        ) : (
                            'Confirm Claim'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClaimForm;
