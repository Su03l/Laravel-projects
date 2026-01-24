'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import api from '@/lib/axios';
import {
    Mail,
    Phone,
    IdCard,
    Calendar,
    ChevronRight,
    ShieldCheck,
    CreditCard,
    Hash,
    Edit2,
    X,
    Check,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
    const { user, setUser } = useUserStore();
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    if (!user) return null;

    const handleUpdate = async () => {
        setSubmitting(true);
        try {
            const response = await api.put('/me', formData);
            setUser(response.data.data);
            setIsEditing(false);
            toast.success('تم تحديث الملف الشخصي بنجاح');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'فشل في تحديث البيانات');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark pb-20 p-6 flex flex-col items-center">
            <Toaster position="top-center" />

            <div className="w-full max-w-md flex flex-col">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard"
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">الملف الشخصي</h1>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </header>

                <main className="space-y-6">
                    {/* Horizontal Header Profile Section */}
                    <div className="glass p-6 rounded-3xl flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-accent flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-brand-blue/20">
                                {user.name[0]}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-brand-dark flex items-center justify-center">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xl font-bold text-white w-full outline-none focus:border-brand-blue"
                                    placeholder="الاسم الكامل"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                            )}
                            <p className="text-brand-blue text-xs font-medium mt-1">عضو منذ {user.joined_at}</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase rounded-md border border-emerald-500/20">
                                    حساب مفعل
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabular Information Sections */}
                    <div className="space-y-4">
                        {/* Section 1: Contact */}
                        <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
                            <div className="px-5 py-4 flex flex-row items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">البريد الإلكتروني</span>
                                </div>
                                <div className="text-left flex-1 pl-4">
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white text-left w-full outline-none focus:border-brand-blue"
                                        />
                                    ) : (
                                        <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                    )}
                                </div>
                            </div>

                            <div className="px-5 py-4 flex flex-row items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">رقم الجوال</span>
                                </div>
                                <div className="text-left font-mono text-sm text-white font-medium">
                                    {user.phone}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Personal */}
                        <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
                            <div className="px-5 py-4 flex flex-row items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                        <IdCard className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">الهوية الوطنية</span>
                                </div>
                                <div className="text-left font-mono text-sm text-white font-medium">
                                    {user.personal_info.national_id}
                                </div>
                            </div>

                            <div className="px-5 py-4 flex flex-row items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">تاريخ الميلاد</span>
                                </div>
                                <div className="text-left text-sm text-white font-medium">
                                    {user.personal_info.dob}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Bank */}
                        <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
                            <div className="px-5 py-4 flex flex-row items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Hash className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">رقم الحساب</span>
                                </div>
                                <div className="text-left font-mono text-sm text-white font-bold tracking-wider">
                                    {user.bank_details?.account_number}
                                </div>
                            </div>

                            <div className="px-5 py-4 flex flex-row items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium">IBAN</span>
                                </div>
                                <div className="text-left font-mono text-xs text-slate-300 font-bold max-w-[180px] break-all">
                                    {user.bank_details?.iban}
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isEditing && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={handleUpdate}
                                disabled={submitting}
                                className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-brand-blue/20"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>حفظ التغييرات</span>
                                        <Check className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
