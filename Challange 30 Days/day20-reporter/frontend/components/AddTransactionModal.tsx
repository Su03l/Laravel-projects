'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { X, Loader2, CheckCircle2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: AddTransactionModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        company: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/transactions', formData);
            toast.success('تمت الإضافة بنجاح', { icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> });
            onSuccess();
            onClose();
            setFormData({
                title: '',
                amount: '',
                type: 'expense',
                company: '',
                date: new Date().toISOString().split('T')[0]
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'صار خطأ، حاول مرة ثانية');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300" dir="rtl">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">سجل عملية جديدة</h3>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الوصف / العنوان</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="مثلاً: استضافة الموقع، تصميم بنر..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">المبلغ</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">النوع</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans bg-white"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="income">دخل</option>
                                    <option value="expense">صرف</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الجهة / الشركة</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            placeholder="مثلاً: جوجل، أمازون..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">التاريخ</label>
                        <input
                            type="date"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-all shadow-lg shadow-sky-600/30 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                            حفظ العملية
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
