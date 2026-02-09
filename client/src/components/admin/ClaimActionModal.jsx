import React, { useState } from 'react';

const ClaimActionModal = ({ isOpen, onClose, onConfirm, action, claim, loading }) => {
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    const isApprove = action === 'approve';
    const isReject = action === 'reject';
    const isCollected = action === 'collected';

    const getTitle = () => {
        if (isApprove) return 'Approve Claim';
        if (isReject) return 'Reject Claim';
        if (isCollected) return 'Mark as Collected';
        return 'Update Claim';
    };

    const getDescription = () => {
        if (isApprove) return `Are you sure you want to approve the claim for "${claim?.itemId?.title}"? This will officially mark the item as claimed.`;
        if (isReject) return `Are you sure you want to reject this claim? The item will remain available for others.`;
        if (isCollected) return `Has the user picked up "${claim?.itemId?.title}"? This will complete the process.`;
        return '';
    };

    const getButtonColor = () => {
        if (isApprove) return 'bg-emerald-500 hover:bg-emerald-600';
        if (isReject) return 'bg-red-500 hover:bg-red-600';
        if (isCollected) return 'bg-slate-800 hover:bg-slate-900';
        return 'bg-sky-500 hover:bg-sky-600';
    };

    const handleSubmit = () => {
        onConfirm(comment);
        setComment('');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all scale-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{getTitle()}</h3>
                <p className="text-slate-600 mb-6">{getDescription()}</p>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Admin Note (Optional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a note for the user..."
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent min-h-[100px] resize-none"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`flex-1 py-3 text-white rounded-lg font-semibold transition-colors flex items-center justify-center ${getButtonColor()}`}
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Confirm'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClaimActionModal;
