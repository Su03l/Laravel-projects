'use client';

import React, { useState } from 'react';
import api from '@/lib/axios';
import {
    Loader2,
    CheckCircle2,
    ChevronRight,
    Wallet,
    Plus,
    Download
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useUserStore } from '@/store/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function DepositPage() {
    const { user, setUser } = useUserStore();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [amount, setAmount] = useState('');
    const [receiptId, setReceiptId] = useState('');

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        setSubmitting(true);
        try {
            const response = await api.post('/deposit', {
                amount: parseFloat(amount)
            });

            setReceiptId(response.data.transaction_id || Math.floor(Math.random() * 1000000).toString());

            // Update local user state with new balance
            if (user && user.bank_details) {
                const newBalance = `${response.data.new_balance} SAR`;
                setUser({
                    ...user,
                    bank_details: {
                        ...user.bank_details,
                        current_balance: newBalance
                    }
                });
            }

            setStep(3);
            toast.success('تم إيداع المبلغ بنجاح');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل في عملية الإيداع');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20 p-6 flex flex-col items-center">
            <Toaster position="top-center" />

            <div className="w-full max-w-md flex flex-col min-h-screen">
                {/* Progress Header */}
                {step < 3 && (
                    <header className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => step > 1 ? setStep(step - 1) : window.location.href = '/dashboard'}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-bold text-white">شحن الرصيد</h1>
                        </div>

                        <div className="flex justify-between items-center px-10 relative">
                            {[1, 2].map((s) => (
                                <div key={s} className="flex flex-col items-center gap-2 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-brand-bg text-slate-600'
                                        }`}>
                                        {s}
                                    </div>
                                    <span className={`text-[10px] ${step >= s ? 'text-emerald-500 font-bold' : 'text-slate-600'}`}>
                                        {s === 1 ? 'المبلغ' : 'تأكيد'}
                                    </span>
                                </div>
                            ))}
                            <div className="absolute left-1/2 -translate-x-1/2 w-20 h-[1px] bg-slate-800 top-4" />
                        </div>
                    </header>
                )}

                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Enter Amount */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                                        <Plus className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">كم تود أن تودع؟</h2>
                                    <p className="text-slate-500 text-sm mt-1">سيتم إضافة المبلغ فوراً لمفظتك</p>
                                </div>

                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">SAR</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-slate-800 focus:border-emerald-500 text-center text-5xl font-bold py-8 text-white outline-none transition-all placeholder:text-slate-800"
                                    />
                                </div>

                                <div className="p-4 bg-brand-bg rounded-2xl flex justify-between items-center">
                                    <span className="text-sm text-slate-400">رصيدك الحالي:</span>
                                    <span className="text-sm font-bold text-slate-200">{user?.bank_details?.current_balance}</span>
                                </div>

                                <button
                                    onClick={() => amount && parseFloat(amount) > 0 && setStep(2)}
                                    className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                                >
                                    المتابعة للتأكيد
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Confirmation */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="glass p-8 rounded-3xl space-y-8 text-center bg-gradient-to-b from-emerald-500/10 to-transparent">
                                    <div className="space-y-2">
                                        <p className="text-slate-400 text-sm">أنت ستقوم بإيداع</p>
                                        <h3 className="text-4xl font-black text-white">{amount} <span className="text-lg">SAR</span></h3>
                                    </div>

                                    <div className="flex items-center justify-between py-6 border-y border-white/5">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">طريقة الإيداع</p>
                                            <p className="font-bold text-white text-lg">ATM Deposit</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center text-emerald-500">
                                            <Wallet className="w-8 h-8" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleDeposit}
                                        disabled={submitting}
                                        className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30"
                                    >
                                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <span>تأكيد الإيداع</span>
                                                <CheckCircle2 className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full py-4 text-slate-400 hover:text-white transition-all font-medium"
                                    >
                                        إلغاء وتعديل
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Success Receipt */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex flex-col items-center justify-center py-10"
                            >
                                <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-10 shadow-2xl shadow-emerald-500/20">
                                    <motion.div
                                        initial={{ rotate: -45, scale: 0 }}
                                        animate={{ rotate: 0, scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                    >
                                        <CheckCircle2 className="w-16 h-16" />
                                    </motion.div>
                                </div>

                                <div className="glass w-full rounded-3xl p-8 relative overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-brand-dark rounded-b-full shadow-inner border-x border-b border-white/5" />

                                    <div className="text-center pt-6 space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-emerald-500 font-bold tracking-widest text-sm uppercase">تم الإيداع بنجاح</p>
                                            <h2 className="text-3xl font-black text-white">{amount} SAR</h2>
                                        </div>

                                        <div className="space-y-4 py-6 border-y border-dashed border-white/20">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">الحساب</span>
                                                <span className="text-slate-200 font-medium">{user?.name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">النوع</span>
                                                <span className="text-slate-200 font-medium">إيداع نقدي</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">رقم المرجع</span>
                                                <span className="text-slate-200 font-mono font-medium">#{receiptId}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => window.location.href = '/dashboard'}
                                                className="flex-1 py-4 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20"
                                            >
                                                العودة للرئيسية
                                            </button>
                                            <button className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 border border-white/10">
                                                <Download className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
