import React from 'react';

const ActivityFeed = ({ recentItems = [], recentClaims = [] }) => {

    // Helper to format date relative or absolute
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Recent Items Column */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <span className="mr-2">📦</span> Recently Added Items
                </h3>
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {recentItems.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No recent items.</p>
                    ) : (
                        recentItems.map((item) => (
                            <div key={item._id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-10 h-10 bg-slate-200 rounded-md overflow-hidden flex-shrink-0">
                                    <img
                                        src={`http://localhost:5001/uploads/${item.image}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/40'}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                                    <p className="text-xs text-slate-500">
                                        Posted by <span className="font-medium">{item.postedBy?.name || 'Unknown'}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                                            item.status === 'claimed' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(item.createdAt)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Recent Claims Column */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <span className="mr-2">📝</span> Recent Claims
                </h3>
                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                    {recentClaims.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No recent claims.</p>
                    ) : (
                        recentClaims.map((claim) => (
                            <div key={claim._id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                                    {claim.userId?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {claim.userId?.name || 'Unknown'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        Claimed: <span className="font-medium">{claim.itemId?.title || 'Unknown Item'}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${claim.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                            claim.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                claim.status === 'collected' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-amber-100 text-amber-700'
                                        }`}>
                                        {claim.status}
                                    </span>
                                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(claim.createdAt)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;
