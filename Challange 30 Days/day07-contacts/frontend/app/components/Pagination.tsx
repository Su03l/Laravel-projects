'use client';

import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
    if (lastPage <= 1) return null;

    const pages: (number | string)[] = [];

    // Build page numbers array
    if (lastPage <= 7) {
        for (let i = 1; i <= lastPage; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', lastPage);
        } else if (currentPage >= lastPage - 2) {
            pages.push(1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
        }
    }

    return (
        <div className="flex items-center justify-center gap-2" dir="rtl">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
                <ChevronRight className="w-4 h-4" />
                السابق
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page
                                    ? 'bg-black text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
                التالي
                <ChevronLeft className="w-4 h-4" />
            </button>
        </div>
    );
}
