"use client";

import { useEffect, useState, Fragment } from "react";
import api from "@/lib/axios";
import { Plus, Users, Calendar, Trash2, Hash, FileText, Type, Building2, Briefcase } from "lucide-react";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

interface Group {
    id: number;
    name: string;
    company_name: string;
    start_date: string;
    end_date: string;
    members_count?: number;
    description?: string;
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        company_name: "",
        description: "",
        start_date: "",
        end_date: "",
    });

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await api.get('/groups');
            const data = Array.isArray(response.data.groups) ? response.data.groups : (response.data.data || []);
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error("فشل تحميل المجموعات");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/groups', formData);
            toast.success("تم إنشاء المجموعة بنجاح");
            setIsModalOpen(false);
            setFormData({ name: "", company_name: "", description: "", start_date: "", end_date: "" });
            fetchGroups();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل إنشاء المجموعة");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">مساحات العمل</h1>
                    <p className="text-slate-500 mt-2 font-medium">أنشئ مجموعات وتعاون مع فريقك بكفاءة عالية.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-sky-200 transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    مجموعة جديدة
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mb-4" />
                    <p className="text-slate-400 font-medium">جاري تحميل المجموعات...</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-20 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد مجموعات بعد</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">ابدأ رحلتك بإنشاء مساحة عمل جديدة ودعوة فريقك للتعاون.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-sky-600 hover:text-sky-700 font-bold hover:underline transition-all">ابدأ الآن &larr;</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-300 group flex flex-col justify-between transform hover:-translate-y-1">
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-2xl flex items-center justify-center text-sky-600 font-extrabold text-2xl border border-sky-100/50 shadow-inner">
                                        {group.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-full text-xs font-bold border border-sky-100">
                                        نشطة
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{group.name}</h3>
                                {group.company_name && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 bg-slate-50 px-3 py-1.5 rounded-lg w-fit">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        <span>{group.company_name}</span>
                                    </div>
                                )}

                                <div className="space-y-3 pt-4 border-t border-slate-50">
                                    {group.start_date && (
                                        <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium">{group.start_date} <span className="text-slate-300 mx-1">|</span> {group.end_date}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium">{group.members_count || 0} عضو في الفريق</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                                <button className="text-sm font-bold text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-4 py-2 rounded-xl transition-all flex items-center gap-2">
                                    عرض التفاصيل
                                    <span className="text-lg leading-none">&larr;</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Group Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 text-right" onClose={() => setIsModalOpen(false)} dir="rtl">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-95 translate-y-4"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-8 align-middle shadow-2xl transition-all relative">
                                    <Dialog.Title as="h3" className="text-2xl font-extrabold leading-6 text-slate-900 mb-2">
                                        مجموعة عمل جديدة
                                    </Dialog.Title>
                                    <p className="text-slate-500 text-sm mb-6">أنشئ مساحة منظمة لفريقك لمتابعة المهام.</p>

                                    <form onSubmit={handleCreateGroup} className="space-y-5">
                                        <div className="relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">اسم المجموعة</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Type className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="مثال: فريق التسويق"
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">اسم الشركة (اختياري)</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Building2 className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formData.company_name}
                                                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                    placeholder="اسم الشركة"
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">وصف المجموعة (اختياري)</label>
                                            <div className="relative">
                                                <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
                                                    <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    rows={2}
                                                    placeholder="وصف مختصر لأهداف المجموعة..."
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium placeholder:text-slate-400 resize-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="flex-1 relative group">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ البدء</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={formData.start_date}
                                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                        className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 relative group">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">تاريخ الانتهاء</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                        <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={formData.end_date}
                                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                        className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-50">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-gradient-to-l from-sky-500 to-sky-600 px-8 py-2.5 text-sm font-bold text-white hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all shadow-lg shadow-sky-200 transform hover:-translate-y-0.5"
                                            >
                                                إنشاء
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
