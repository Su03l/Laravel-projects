'use client';

import { FileText, ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react';

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
            toast.success('تم تحميل الفاتورة', { icon: <FileText className="h-5 w-5 text-sky-500" /> });
        } catch (error) {
            console.error(error);
            toast.error('ما قدرنا نحمل الفاتورة، تأكد من الاتصال');
        } finally {
            setDownloading(null);
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-right text-sm text-gray-500">
                    <thead className="bg-gray-50/50 text-xs font-bold uppercase text-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-4">التاريخ</th>
                            <th scope="col" className="px-6 py-4">تفاصيل / الشركة</th>
                            <th scope="col" className="px-6 py-4">النوع</th>
                            <th scope="col" className="px-6 py-4">المبلغ</th>
                            <th scope="col" className="px-6 py-4 text-left">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                                            <Inbox className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p>ما فيه عمليات حالياً، ضيف أول عملية!</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 font-mono text-xs">
                                        {new Date(tx.date).toLocaleDateString('ar-EG')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{tx.company}</div>
                                        <div className="text-xs text-gray-400">{tx.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${tx.type === 'income'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {tx.type === 'income' ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                                            {tx.type === 'income' ? 'دخل' : 'صرف'}
                                        </span>
                                    </td>
                                    <td className={`whitespace-nowrap px-6 py-4 font-black text-base ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`} dir="ltr">
                                        {tx.type === 'income' ? '+' : '-'} ${Number(tx.amount).toFixed(2)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-left">
                                        <button
                                            onClick={() => handleDownload(tx.id)}
                                            disabled={downloading === tx.id}
                                            className="inline-flex items-center gap-2 rounded-xl p-2 text-sky-600 hover:bg-sky-50 transition-colors disabled:opacity-50"
                                            title="تحميل PDF"
                                        >
                                            {downloading === tx.id ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-600 border-t-transparent" />
                                            ) : (
                                                <>
                                                    <span className="text-xs font-bold hidden sm:inline">تحميل فاتورة</span>
                                                    <FileText className="h-5 w-5" />
                                                </>
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
