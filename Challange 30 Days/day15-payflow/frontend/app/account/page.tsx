'use client';

import React from 'react';
import { useUserStore } from '@/store/useUserStore';
import {
    Hash,
    CreditCard,
    ChevronRight,
    Copy,
    Check,
    ShieldCheck,
    Info
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AccountDetailsPage() {
    const { user } = useUserStore();
    const [copied, setCopied] = useState<string | null>(null);

    if (!user) return null;

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20 p-6 flex flex-col items-center">
            <div className="w-full max-w-md flex flex-col">
                <header className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">تفاصيل الحساب</h1>
                </header>

                <main className="space-y-6">
                    <div className="glass p-6 rounded-3xl bg-brand-blue/5 border border-brand-blue/10 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">بياناتك محمية</p>
                            <p className="text-xs text-slate-400 mt-1">لا تشارك هذه المعلومات مع أي شخص غير موثوق به.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Account Number */}
                        <div className="glass p-5 rounded-3xl space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <Hash className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">رقم الحساب</span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user.bank_details?.account_number || '', 'account')}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                                >
                                    {copied === 'account' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xl font-bold text-white font-mono tracking-widest pl-2">
                                {user.bank_details?.account_number}
                            </p>
                        </div>

                        {/* IBAN */}
                        <div className="glass p-5 rounded-3xl space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <CreditCard className="w-4 h-4" />
                                    <span className="text-xs font-medium uppercase tracking-wider">رقم الآيبان (IBAN)</span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(user.bank_details?.iban || '', 'iban')}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400"
                                >
                                    {copied === 'iban' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-sm font-bold text-white font-mono break-all pl-2 leading-relaxed">
                                {user.bank_details?.iban}
                            </p>
                        </div>
                    </div>

                    <div className="p-6 text-center space-y-2 opacity-50">
                        <Info className="w-8 h-8 mx-auto text-slate-500" />
                        <p className="text-xs text-slate-300">استخدم هذه البيانات لاستقبال الحوالات البنكية من البنوك الأخرى.</p>
                    </div>
                </main>
            </div>
        </div>
    );
}
