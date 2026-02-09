import React from 'react';

const SortDropdown = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Sort By:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full md:w-48 px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
            >
                <option value="recent">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="az">Title (A-Z)</option>
                <option value="za">Title (Z-A)</option>
            </select>
        </div>
    );
};

export default SortDropdown;
