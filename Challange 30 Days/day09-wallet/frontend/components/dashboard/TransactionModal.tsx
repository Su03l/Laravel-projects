'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '@/types';
import { X } from 'lucide-react';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    initialData?: Transaction | null;
}

export default function TransactionModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: TransactionModalProps) {
    const [formData, setFormData] = useState<TransactionFormData>({
        title: '',
        amount: 0,
        type: 'income',
        transaction_date: new Date().toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                amount: initialData.amount,
                type: initialData.type,
                transaction_date: initialData.transaction_date.split('T')[0],
            });
        } else {
            setFormData({
                title: '',
                amount: 0,
                type: 'income',
                transaction_date: new Date().toISOString().split('T')[0],
            });
        }
        setError(null);
    }, [initialData, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.title.trim()) {
            setError('يرجى إدخال عنوان المعاملة');
            return;
        }

        if (formData.amount <= 0) {
            setError('يرجى إدخال مبلغ صحيح');
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch {
            setError('حدث خطأ أثناء حفظ المعاملة');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {initialData ? 'تعديل المعاملة' : 'إضافة معاملة جديدة'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            العنوان
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="مثال: راتب شهري"
                        />
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            المبلغ
                        </label>
                        <input
                            type="number"
                            value={formData.amount || ''}
                            onChange={(e) =>
                                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            النوع
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'income' })}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.type === 'income'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                دخل
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'expense' })}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${formData.type === 'expense'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                مصروف
                            </button>
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            التاريخ
                        </label>
                        <input
                            type="date"
                            value={formData.transaction_date}
                            onChange={(e) =>
                                setFormData({ ...formData, transaction_date: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'جاري الحفظ...' : initialData ? 'تحديث' : 'إضافة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
