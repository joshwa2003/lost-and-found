import React from 'react';

const FilterPanel = ({ filters, onFilterChange, locations = [] }) => {

    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    return (
        <div className="space-y-4">
            {/* Location Filter */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location
                </label>
                <select
                    value={filters.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                >
                    <option value="all">All Locations</option>
                    {locations.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            {/* Date Found Filter */}
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date Found
                </label>
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
            </div>

            {/* Clear Filters Link */}
            {(filters.location !== 'all' || filters.date) && (
                <button
                    onClick={() => onFilterChange({ ...filters, location: 'all', date: '' })}
                    className="text-sm text-sky-600 hover:text-sky-800 font-medium"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
