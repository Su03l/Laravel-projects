'use client';

import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import api from '@/lib/axios';
import BankCard from '@/components/BankCard';
import {
    Send,
    Plus,
    History,
    ArrowUpRight,
    ArrowDownLeft,
    Loader2,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';
import UserDropdown from '@/components/UserDropdown';
import { Transaction } from '@/types';

export default function Dashboard() {
    const { user, setUser } = useUserStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [meRes, transRes] = await Promise.all([
                    api.get('/me'),
                    api.get('/transactions')
                ]);
                setUser(meRes.data.data);
                setTransactions(transRes.data.data?.slice(0, 5) || []); // Show latest 5
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [setUser]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark overflow-x-hidden pb-20 flex flex-col items-center">
            <div className="w-full max-w-md min-h-screen flex flex-col">
                {/* Header */}
                <header className="p-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white tracking-tight">لوحة التحكم</h1>
                    <UserDropdown />
                </header>

                {/* Hero / Main Card */}
                <section className="px-6 py-4 space-y-4">
                    <BankCard
                        name={user?.name || ''}
                        balance={user?.bank_details?.current_balance || '0.00 SAR'}
                    />
                    <div className="flex justify-center">
                        <Link
                            href="/account"
                            className="text-xs font-bold text-slate-500 hover:text-brand-blue flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 transition-colors"
                        >
                            <CreditCard className="w-3.5 h-3.5" />
                            عرض تفاصيل الحساب والآيبان
                        </Link>
                    </div>
                </section>

                {/* Quick Actions */}
                <section className="px-6 py-8">
                    <div className="grid grid-cols-3 gap-4">
                        <Link href="/transfer" className="flex flex-col items-center gap-2 group">
                            <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all shadow-lg shadow-brand-blue/5">
                                <Send className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-medium text-slate-300">تحويل</span>
                        </Link>
                        <Link href="/deposit" className="flex flex-col items-center gap-2 group">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-lg shadow-emerald-500/5">
                                <Plus className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-medium text-slate-300">شحن</span>
                        </Link>
                        <Link href="/history" className="flex flex-col items-center gap-2 group">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-lg shadow-amber-500/5">
                                <History className="w-7 h-7" />
                            </div>
                            <span className="text-xs font-medium text-slate-300">السجل</span>
                        </Link>
                    </div>
                </section>

                {/* Transactions List */}
                <section className="px-6 pb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">آخر العمليات</h3>
                        <Link href="/history" className="text-sm text-brand-blue font-medium">عرض الكل</Link>
                    </div>

                    <div className="space-y-3">
                        {transactions.map((tx, idx) => (
                            <div key={tx.id || `tx-${idx}`} className="glass p-4 rounded-2xl flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.direction === 'In' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {tx.direction === 'In' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white truncate max-w-[120px]">{tx.other_party}</p>
                                        <p className="text-xs text-slate-500">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${tx.direction === 'In' ? 'text-emerald-500' : 'text-red-500'
                                        }`}>
                                        {tx.direction === 'In' ? '+' : '-'}{tx.amount}
                                    </p>
                                    <p className="text-[10px] text-slate-500 uppercase">{tx.type}</p>
                                </div>
                            </div>
                        ))}

                        {transactions.length === 0 && (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-slate-400">لا توجد عمليات سابقة</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
