import React from 'react';

const DashboardLoader = () => {
    return (
        <div className="animate-pulse space-y-8">
            {/* Stats Header */}
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-slate-200 rounded-xl"></div>
                <div className="h-80 bg-slate-200 rounded-xl"></div>
            </div>

            {/* Activity Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-96 bg-slate-200 rounded-xl"></div>
                <div className="h-96 bg-slate-200 rounded-xl"></div>
            </div>
        </div>
    );
};

export default DashboardLoader;
