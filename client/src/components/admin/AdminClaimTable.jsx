import React from 'react';
import ClaimStatusBadge from '../ClaimStatusBadge';

const AdminClaimTable = ({ claims, onAction }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Item</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {claims.map((claim) => (
                        <tr key={claim._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                                        {claim.itemId?.image ? (
                                            <img
                                                className="h-full w-full object-cover"
                                                src={`http://localhost:5001/uploads/${claim.itemId.image}`}
                                                alt=""
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        ) : (
                                            <span className="text-xl">📷</span>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-slate-900 max-w-[200px] truncate" title={claim.itemId?.title}>
                                            {claim.itemId?.title || 'Unknown Item'}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            ID: {claim.itemId?._id?.slice(-6).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900">{claim.userId?.name}</div>
                                <div className="text-xs text-slate-500">{claim.userId?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                {formatDate(claim.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ClaimStatusBadge status={claim.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2">
                                    {claim.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => onAction('approve', claim)}
                                                className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => onAction('reject', claim)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {claim.status === 'approved' && (
                                        <button
                                            onClick={() => onAction('collected', claim)}
                                            className="text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition-colors flex items-center"
                                        >
                                            <span className="mr-1">🤝</span> Collected
                                        </button>
                                    )}
                                    {/* No actions for rejected or completed claims, maybe just a view logic later */}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminClaimTable;
