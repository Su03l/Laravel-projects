'use client';

import { useState, KeyboardEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Loader2 } from 'lucide-react';

interface SearchInputProps {
    onSearch: (city: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export default function SearchInput({
    onSearch,
    isLoading = false,
    placeholder = 'ابحث عن مدينة...',
}: SearchInputProps) {
    const [query, setQuery] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim() && !isLoading) {
            onSearch(query.trim());
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = () => {
        if (query.trim() && !isLoading) {
            onSearch(query.trim());
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-2xl"
        >
            <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/5 to-white/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Glass search bar */}
                <div className="relative flex items-center backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                    {/* Search icon */}
                    <div className="pl-6 text-gray-400">
                        <Search className="h-6 w-6" strokeWidth={1.5} />
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="flex-1 bg-transparent text-white text-lg py-5 px-4 placeholder-gray-500 focus:outline-none disabled:opacity-50"
                    />

                    {/* Search button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !query.trim()}
                        className="px-6 py-5 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            >
                                <Loader2 className="h-6 w-6" strokeWidth={1.5} />
                            </motion.div>
                        ) : (
                            <ArrowRight className="h-6 w-6" strokeWidth={1.5} />
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
