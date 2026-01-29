'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Column {
    header: string;
    accessor: string;
    render?: (row: any) => React.ReactNode;
    className?: string;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    loading?: boolean;
    pagination?: {
        current_page: number;
        last_page: number;
        total: number;
        onPageChange: (page: number) => void;
    };
    actionButton?: {
        label: string;
        onClick: () => void;
    };
}

export default function DataTable({ columns, data, loading, pagination, actionButton }: DataTableProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="animate-spin text-sky-500" size={32} />
                    <span>جاري تحميل البيانات...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header Actions */}
            {actionButton && (
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-700">البيانات ({pagination?.total || data.length})</h3>
                    <Button onClick={actionButton.onClick} className="text-sm py-2">
                        {actionButton.label}
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 text-sm font-bold border-b border-slate-100">
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-sky-50/30 transition-colors">
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                                            {col.render ? col.render(row) : (
                                                col.accessor.split('.').reduce((o, i) => o?.[i], row) || '-'
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                                    لا توجد بيانات متاحة حالياً
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <div className="p-4 border-t border-slate-50 flex justify-center items-center gap-2">
                    <button
                        disabled={pagination.current_page === 1}
                        onClick={() => pagination.onPageChange(pagination.current_page - 1)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={18} />
                    </button>

                    <span className="text-sm font-medium text-slate-600">
                        صفحة {pagination.current_page} من {pagination.last_page}
                    </span>

                    <button
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => pagination.onPageChange(pagination.current_page + 1)}
                        className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}
