'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    debounceMs?: number;
}

export default function SearchBar({ onSearch, debounceMs = 500 }: SearchBarProps) {
    const [query, setQuery] = useState('');

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, onSearch, debounceMs]);

    const handleClear = useCallback(() => {
        setQuery('');
        onSearch('');
    }, [onSearch]);

    return (
        <div className="relative w-full max-w-2xl mx-auto" dir="rtl">
            {/* Search Icon */}
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>

            {/* Input */}
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن جهات الاتصال بالاسم أو الرقم..."
                className="w-full pr-12 pl-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors bg-white"
            />

            {/* Clear Button */}
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 hover:text-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
