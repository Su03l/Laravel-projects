'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Beneficiary } from '@/types';
import {
    Loader2,
    User as UserIcon,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Wallet,
    Send,
    Download,
    UserPlus
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { useUserStore } from '@/store/useUserStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransferPage() {
    const { user } = useUserStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);

    // Selection/Form states
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [receiptId, setReceiptId] = useState('');

    useEffect(() => {
        const fetchBeneficiaries = async () => {
            try {
                const response = await api.get('/beneficiaries');
                setBeneficiaries(response.data.data);
            } catch {
                toast.error('فشل في تحميل المستفيدين');
            } finally {
                setLoading(false);
            }
        };
        fetchBeneficiaries();
    }, []);

    const handleTransfer = async () => {
        if (!selectedBeneficiary || !amount) return;

        // Simple validation
        const numAmount = parseFloat(amount);
        const balance = parseFloat(user?.bank_details?.current_balance?.replace(/[^\d.]/g, '') || '0');

        if (numAmount > balance) {
            toast.error('رصيدك غير كافي لإتمام هذه العملية');
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post('/transfer', {
                beneficiary_id: selectedBeneficiary.id,
                amount: numAmount,
                description: description
            });
            setReceiptId(response.data.transaction_id || Math.floor(Math.random() * 1000000).toString());
            setStep(4);
            toast.success('تم تحويل المبلغ بنجاح');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل في إتمام عملية التحويل');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-brand-dark">
                <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark pb-20 p-6 flex flex-col items-center">
            <Toaster position="top-center" />

            <div className="w-full max-w-md flex flex-col min-h-screen">
                {/* Progress Header */}
                {step < 4 && (
                    <header className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => step > 1 ? setStep(step - 1) : window.location.href = '/dashboard'}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-bold text-white">تحويل أموال</h1>
                        </div>

                        <div className="flex justify-between items-center px-2 relative">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex flex-col items-center gap-2 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-brand-bg text-slate-600'
                                        }`}>
                                        {s}
                                    </div>
                                    <span className={`text-[10px] ${step >= s ? 'text-brand-blue font-bold' : 'text-slate-600'}`}>
                                        {s === 1 ? 'المستفيد' : s === 2 ? 'المبلغ' : 'تأكيد'}
                                    </span>
                                </div>
                            ))}
                            {/* Connecting lines */}
                            <div className="absolute left-8 right-8 h-[1px] bg-slate-800 top-4" />
                        </div>
                    </header>
                )}

                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Select Beneficiary */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <h2 className="text-lg font-medium text-slate-300 mb-4">اختر المستفيد من القائمة:</h2>
                                <div className="grid gap-3">
                                    <button
                                        onClick={() => window.location.href = '/beneficiaries'}
                                        className="glass p-4 rounded-2xl flex items-center gap-4 text-right transition-all border-2 border-dashed border-white/10 hover:border-brand-blue/50 group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                                            <UserPlus className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-white">إضافة مستفيد جديد</p>
                                            <p className="text-xs text-slate-500">إضافة جهة اتصال سريعة</p>
                                        </div>
                                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                                    </button>

                                    {beneficiaries.map((b) => (
                                        <button
                                            key={b.id}
                                            onClick={() => { setSelectedBeneficiary(b); setStep(2); }}
                                            className={`glass p-4 rounded-2xl flex items-center gap-4 text-right transition-all border-2 ${selectedBeneficiary?.id === b.id ? 'border-brand-blue bg-brand-blue/5' : 'border-transparent'
                                                }`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center text-slate-400">
                                                <UserIcon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-white">{b.alias_name || b.name}</p>
                                                <p className="text-xs text-slate-500 font-mono mt-0.5">{b.account_number}</p>
                                            </div>
                                            <ChevronLeft className="w-5 h-5 text-slate-600" />
                                        </button>
                                    ))}

                                    {beneficiaries.length === 0 && (
                                        <div className="text-center py-20 bg-white/5 rounded-3xl">
                                            <p className="text-slate-400 mb-4">لا يوجد مستفيدين حالياً</p>
                                            <button
                                                onClick={() => window.location.href = '/beneficiaries'}
                                                className="px-6 py-2 bg-brand-blue text-white rounded-lg text-sm"
                                            >
                                                إضافة مستفيد
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Enter Amount */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-4">
                                        <Wallet className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">إدخال المبلغ</h2>
                                    <p className="text-slate-500 text-sm mt-1">المستفيد: {selectedBeneficiary?.alias_name || selectedBeneficiary?.name}</p>
                                </div>

                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">SAR</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-slate-800 focus:border-brand-blue text-center text-5xl font-bold py-8 text-white outline-none transition-all placeholder:text-slate-800"
                                    />
                                </div>

                                <div className="p-4 bg-brand-bg rounded-2xl flex justify-between items-center">
                                    <span className="text-sm text-slate-400">رصيدك المتاح:</span>
                                    <span className="text-sm font-bold text-slate-200">{user?.bank_details?.current_balance}</span>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">ملاحظات (اختياري)</label>
                                    <input
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-4 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-white placeholder:text-slate-600"
                                        placeholder="مثال: إيجار الشقة"
                                    />
                                </div>

                                <button
                                    onClick={() => amount && parseFloat(amount) > 0 && setStep(3)}
                                    className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-lg hover:bg-brand-blue/90 transition-all shadow-xl shadow-brand-blue/20"
                                >
                                    المتابعة للتأكيد
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Confirmation */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="glass p-8 rounded-3xl space-y-8 text-center bg-gradient-to-b from-brand-blue/10 to-transparent">
                                    <div className="space-y-2">
                                        <p className="text-slate-400 text-sm">أنت ستقوم بتحويل</p>
                                        <h3 className="text-4xl font-black text-white">{amount} <span className="text-lg">SAR</span></h3>
                                    </div>

                                    <div className="flex items-center justify-between py-6 border-y border-white/5">
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">إلى المستفيد</p>
                                            <p className="font-bold text-white text-lg">{selectedBeneficiary?.alias_name || selectedBeneficiary?.name}</p>
                                            <p className="text-xs text-slate-500 font-mono mt-1">{selectedBeneficiary?.account_number}</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center text-brand-blue">
                                            <Send className="w-8 h-8" />
                                        </div>
                                    </div>

                                    {description && (
                                        <div className="text-right">
                                            <p className="text-xs text-slate-500 mb-1">الملاحظات</p>
                                            <p className="text-sm text-slate-300 italic">&ldquo;{description}&rdquo;</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={handleTransfer}
                                        disabled={submitting}
                                        className="w-full py-5 bg-brand-blue text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-blue/30"
                                    >
                                        {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <span>تأكيد وإرسال</span>
                                                <CheckCircle2 className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 text-slate-400 hover:text-white transition-all font-medium"
                                    >
                                        إلغاء وتعديل
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Success Receipt */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
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
                                    {/* Receipt cut effect top */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-brand-dark rounded-b-full shadow-inner border-x border-b border-white/5" />

                                    <div className="text-center pt-6 space-y-6">
                                        <div className="space-y-1">
                                            <p className="text-emerald-500 font-bold tracking-widest text-sm uppercase">تمت العملية بنجاح</p>
                                            <h2 className="text-3xl font-black text-white">{amount} SAR</h2>
                                        </div>

                                        <div className="space-y-4 py-6 border-y border-dashed border-white/20">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">من</span>
                                                <span className="text-slate-200 font-medium">{user?.name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">إلى</span>
                                                <span className="text-slate-200 font-medium">{selectedBeneficiary?.alias_name || selectedBeneficiary?.name}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">رقم العملية</span>
                                                <span className="text-slate-200 font-mono font-medium">#{receiptId}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => window.location.href = '/dashboard'}
                                                className="flex-1 py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20"
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
