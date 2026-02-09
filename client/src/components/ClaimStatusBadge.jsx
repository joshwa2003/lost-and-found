import React from 'react';

const ClaimStatusBadge = ({ status }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return '✅';
            case 'rejected':
                return '❌';
            case 'pending':
                return '⏳';
            default:
                return '❓';
        }
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
            <span className="mr-1.5">{getStatusIcon(status)}</span>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default ClaimStatusBadge;
