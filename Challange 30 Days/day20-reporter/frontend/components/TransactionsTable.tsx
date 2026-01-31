'use client';

import { Download, FileText } from 'lucide-react';

import { useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';

interface Transaction {
    id: number;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    company: string;
    date: string; // ISO string
}

interface TransactionsTableProps {
    transactions: Transaction[];
    refreshHelpers?: () => void;
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
    const [downloading, setDownloading] = useState<number | null>(null);

    const handleDownload = async (id: number) => {
        setDownloading(id);
        try {
            const response = await axios.get(`/report/invoice/${id}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            toast.error('Failed to download invoice');
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-medium">Date</th>
                            <th scope="col" className="px-6 py-4 font-medium">Company / Details</th>
                            <th scope="col" className="px-6 py-4 font-medium">Type</th>
                            <th scope="col" className="px-6 py-4 font-medium">Amount</th>
                            <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/50">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                                        {new Date(tx.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{tx.company}</div>
                                        <div className="text-xs text-gray-500">{tx.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.type === 'income'
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                                }`}
                                        >
                                            {tx.type === 'income' ? 'Income' : 'Expense'}
                                        </span>
                                    </td>
                                    <td className={`whitespace-nowrap px-6 py-4 font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDownload(tx.id)}
                                            disabled={downloading === tx.id}
                                            className="inline-flex items-center gap-1 rounded-lg p-2 text-sky-600 hover:bg-sky-50 transition-colors disabled:opacity-50"
                                            title="Download PDF"
                                        >
                                            {downloading === tx.id ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                                            ) : (
                                                <FileText className="h-4 w-4" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
