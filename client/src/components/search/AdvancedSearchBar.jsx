import React, { useState, useEffect } from 'react';

const AdvancedSearchBar = ({ onSearch, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items by title, desc, or location..."
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all shadow-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400">
                🔍
            </span>
            {query && (
                <button
                    onClick={() => setQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <span className="text-xl">✕</span>
                </button>
            )}
        </div>
    );
};

export default AdvancedSearchBar;
