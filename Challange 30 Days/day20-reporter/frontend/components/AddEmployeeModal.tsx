'use client';

import { useState } from 'react';
import axios from '@/lib/axios';
import toast from 'react-hot-toast';
import { X, Loader2, UserPlus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddEmployeeModal({ isOpen, onClose }: AddEmployeeModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/admin/add-employee', formData);
            toast.success('تم إضافة الموظف بنجاح', { icon: <CheckCircle2 className="h-5 w-5 text-green-500" /> });
            onClose();
            setFormData({ name: '', email: '', password: '' });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'فشلت عملية الإضافة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300" dir="rtl">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">إضافة موظف جديد</h3>
                        <UserPlus className="h-6 w-6 text-sky-600" />
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الثلاثي</label>
                        <input
                            type="text"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="فلان الفلاني"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">كمة المرور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-12 text-sm focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-sans"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 hover:text-sky-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
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
                            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all shadow-lg shadow-gray-900/20 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                            إضافة الحساب
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
