import React from 'react';

const StatCard = ({ title, count, icon, color, subtext }) => {
    // Generate color classes based on the color prop
    const getColorClasses = () => {
        switch (color) {
            case 'blue': return 'bg-blue-100 text-blue-600';
            case 'green': return 'bg-emerald-100 text-emerald-600';
            case 'yellow': return 'bg-amber-100 text-amber-600';
            case 'red': return 'bg-red-100 text-red-600';
            case 'purple': return 'bg-purple-100 text-purple-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getColorClasses()}`}>
                    {icon}
                </div>
                {/* Optional positive/negative trend indicator could go here */}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{count}</h3>
                {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
            </div>
        </div>
    );
};

export default StatCard;
