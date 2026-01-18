'use client';

import { Transaction } from '@/types';
import { Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionTableProps {
    transactions: Transaction[];
    loading: boolean;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: number) => void;
}

export default function TransactionTable({
    transactions,
    loading,
    onEdit,
    onDelete,
}: TransactionTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-gray-200 rounded-xl"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                    <Wallet className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    لا توجد معاملات
                </h3>
                <p className="text-gray-500">
                    ابدأ بإضافة أول معاملة لتتبع أموالك
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                العنوان
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                المبلغ
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                النوع
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                التاريخ
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-2 rounded-xl ${transaction.type === 'income'
                                                    ? 'bg-green-50'
                                                    : 'bg-red-50'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? (
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500" />
                                            )}
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {transaction.title}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`font-semibold ${transaction.type === 'income'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                    >
                                        {transaction.type === 'income' ? '+' : '-'}$
                                        {transaction.amount.toLocaleString('en-US', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {transaction.type === 'income' ? 'دخل' : 'مصروف'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {formatDate(transaction.transaction_date)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => onEdit(transaction)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="تعديل"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(transaction.id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="حذف"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-xl ${transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                                        }`}
                                >
                                    {transaction.type === 'income' ? (
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{transaction.title}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(transaction.transaction_date)}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {transaction.type === 'income' ? '+' : '-'}$
                                {transaction.amount.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'income'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}
                            >
                                {transaction.type === 'income' ? 'دخل' : 'مصروف'}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(transaction.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Wallet icon for empty state
function Wallet({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
        </svg>
    );
}
