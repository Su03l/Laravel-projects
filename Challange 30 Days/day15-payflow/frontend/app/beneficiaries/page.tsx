'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Beneficiary } from '@/types';
import {
    UserPlus,
    Loader2,
    User as UserIcon,
    X,
    ArrowRight,
    Trash2,
    Edit2,
    Check
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingBeneficiary, setEditingBeneficiary] = useState<Beneficiary | null>(null);

    // Form states for adding
    const [searchType, setSearchType] = useState('phone');
    const [searchValue, setSearchValue] = useState('');
    const [aliasName, setAliasName] = useState('');

    // Form states for editing
    const [editAliasName, setEditAliasName] = useState('');

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

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    const handleAddBeneficiary = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/beneficiaries', {
                search_type: searchType,
                search_value: searchValue,
                alias_name: aliasName
            });
            toast.success('تم إضافة المستفيد بنجاح');
            setShowAddModal(false);
            fetchBeneficiaries();
            setSearchValue('');
            setAliasName('');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل في إضافة المستفيد');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBeneficiary = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذا المستفيد؟')) return;

        try {
            await api.delete(`/beneficiaries/${id}`);
            toast.success('تم حذف المستفيد');
            setBeneficiaries(beneficiaries.filter(b => b.id !== id));
        } catch {
            toast.error('فشل في حذف المستفيد');
        }
    };

    const handleUpdateBeneficiary = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBeneficiary) return;

        setSubmitting(true);
        try {
            await api.put(`/beneficiaries/${editingBeneficiary.id}`, {
                alias_name: editAliasName
            });
            toast.success('تم تحديث البيانات');
            setEditingBeneficiary(null);
            fetchBeneficiaries();
        } catch {
            toast.error('فشل في تحديث البيانات');
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

            <div className="w-full max-w-md flex flex-col">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white">المستفيدين</h1>
                        <p className="text-slate-400 text-sm">إدارة جهات الاتصال الخاصة بك</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-12 h-12 rounded-2xl bg-brand-blue flex items-center justify-center text-white shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
                    >
                        <UserPlus className="w-6 h-6" />
                    </button>
                </header>

                <div className="grid gap-4">
                    <AnimatePresence>
                        {beneficiaries.map((b) => (
                            <motion.div
                                key={b.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="glass p-4 rounded-2xl"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-bg flex items-center justify-center text-slate-400">
                                            <UserIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-lg">{b.alias_name || b.name}</p>
                                            {b.alias_name && <p className="text-xs text-slate-500">{b.name}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingBeneficiary(b);
                                                setEditAliasName(b.alias_name || '');
                                            }}
                                            className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-brand-blue hover:bg-white/10 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBeneficiary(b.id)}
                                            className="p-2 bg-white/5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 uppercase">رقم الحساب</p>
                                        <p className="text-xs text-slate-300 font-mono">{b.account_number}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-slate-500 uppercase">IBAN</p>
                                        <p className="text-xs text-slate-400 font-mono italic">{b.iban?.substring(0, 8) || '---'}...</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {beneficiaries.length === 0 && (
                        <div className="text-center py-20 opacity-40">
                            <UserPlus className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-slate-300">لم تقم بإضافة أي مستفيد بعد</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="w-full max-w-md bg-brand-dark rounded-t-3xl sm:rounded-3xl p-8 border-t border-white/5"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">إضافة مستفيد جديد</h2>
                                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddBeneficiary} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">نوع البحث</label>
                                    <select
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                        className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-white appearance-none"
                                    >
                                        <option value="phone">رقم الجوال</option>
                                        <option value="account_number">رقم الحساب</option>
                                        <option value="iban">الايبان (IBAN)</option>
                                        <option value="email">البريد الإلكتروني</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">القيمة</label>
                                    <input
                                        type="text"
                                        required
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-white placeholder:text-slate-600"
                                        placeholder="أدخل رقم الجوال أو الحساب..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">اسم مستعار (اختياري)</label>
                                    <input
                                        type="text"
                                        value={aliasName}
                                        onChange={(e) => setAliasName(e.target.value)}
                                        className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-white placeholder:text-slate-600"
                                        placeholder="مثال: صديقي أحمد"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-blue/20"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'حفظ المستفيد'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingBeneficiary && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            className="w-full max-w-md bg-brand-dark rounded-t-3xl sm:rounded-3xl p-8 border-t border-white/5"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">تعديل بيانات المستفيد</h2>
                                <button onClick={() => setEditingBeneficiary(null)} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateBeneficiary} className="space-y-6">
                                <div className="p-4 bg-white/5 rounded-2xl space-y-2">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest">المستفيد المسجل باسم</p>
                                    <p className="font-bold text-white">{editingBeneficiary.name}</p>
                                    <p className="text-xs font-mono text-slate-400 italic">{editingBeneficiary.account_number}</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">الاسم المستعار</label>
                                    <input
                                        type="text"
                                        value={editAliasName}
                                        onChange={(e) => setEditAliasName(e.target.value)}
                                        className="w-full px-4 py-3 bg-brand-bg border border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-white placeholder:text-slate-600"
                                        placeholder="تعديل الاسم المستعار..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span>حفظ التعديلات</span>
                                            <Check className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navigation Shortcut */}
            <Link href="/dashboard" className="fixed bottom-6 w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-white shadow-2xl hover:bg-white/10 transition-colors">
                <ArrowRight className="w-6 h-6" />
            </Link>
        </div>
    );
}
