'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Transaction } from '@/types';
import {
    Loader2,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'In' | 'Out'>('all');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/transactions');
                setTransactions(response.data.data);
            } catch (error) {
                console.error('Failed to fetch transactions', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(tx =>
        filter === 'all' ? true : tx.direction === filter
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark pb-20 p-6 flex flex-col items-center">
            <div className="w-full max-w-md flex flex-col">
                <header className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href="/dashboard"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">سجل العمليات</h1>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${filter === 'all' ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-white/5 text-slate-400'
                                }`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setFilter('In')}
                            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${filter === 'In' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400'
                                }`}
                        >
                            المستلمة (+)
                        </button>
                        <button
                            onClick={() => setFilter('Out')}
                            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${filter === 'Out' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-white/5 text-slate-400'
                                }`}
                        >
                            المرسلة (-)
                        </button>
                    </div>
                </header>

                <main className="flex-1 space-y-4">
                    {filteredTransactions.map((tx, idx) => (
                        <div key={tx.id || `tx-${idx}`} className="glass p-5 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.direction === 'In' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {tx.direction === 'In' ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg truncate max-w-[150px]">{tx.other_party}</p>
                                    <p className="text-xs text-slate-500">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className={`text-xl font-black ${tx.direction === 'In' ? 'text-emerald-500' : 'text-red-500'
                                    }`}>
                                    {tx.direction === 'In' ? '+' : '-'}{tx.amount}
                                </p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">{tx.type}</p>
                            </div>
                        </div>
                    ))}

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-20 opacity-30 flex flex-col items-center gap-4">
                            <Search className="w-16 h-16" />
                            <p className="text-slate-300">لا توجد عمليات تطابق هذا الفلتر</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
