"use client";

import { useEffect, useState, Fragment } from "react";
import api from "@/lib/axios";
import { Plus, Users, Calendar, Trash2, Hash, FileText, Type, Building2, Briefcase, ChevronLeft } from "lucide-react";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import Link from "next/link";

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
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header Section - Matches Tasks Page */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">مساحات العمل</h1>
                    <p className="text-slate-500 text-lg font-medium">
                        أنشئ مجموعات وتعاون مع فريقك بكفاءة عالية.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>مجموعة جديدة</span>
                </button>
            </div>

            {/* Groups Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-72 rounded-[2rem] bg-slate-100 animate-pulse"></div>
                    ))}
                </div>
            ) : groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm border-dashed text-center px-4">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <Users className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">لا توجد مجموعات بعد</h3>
                    <p className="text-slate-500 text-lg max-w-md mb-8">
                        ابدأ رحلتك بإنشاء مساحة عمل جديدة ودعوة فريقك للتعاون.
                    </p>
                    <button onClick={() => setIsModalOpen(true)} className="text-sky-600 text-lg font-bold hover:underline flex items-center gap-2">
                        <span>ابدأ الآن</span>
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groups.map((group) => (
                        <div key={group.id} className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl border border-slate-100 shadow-inner">
                                        {group.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide">
                                        نشطة
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                    {group.name}
                                </h3>

                                {group.company_name && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-bold">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        <span>{group.company_name}</span>
                                    </div>
                                )}

                                <p className="text-base text-slate-500 font-medium line-clamp-2 mb-6">
                                    {group.description || "لا يوجد وصف لهذه المجموعة."}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-50 space-y-4">
                                <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>{group.members_count || 0} عضو</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>{group.start_date}</span>
                                    </div>
                                </div>

                                <Link href={`/dashboard/groups/${group.id}`}>
                                    <button className="w-full py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                        عرض التفاصيل
                                    </button>
                                </Link>
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
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-[2rem] bg-white p-10 align-middle shadow-2xl transition-all relative">
                                    <Dialog.Title as="h3" className="text-3xl font-black leading-tight text-slate-900 mb-2">
                                        مجموعة جديدة
                                    </Dialog.Title>
                                    <p className="text-slate-500 font-medium mb-8">
                                        أنشئ مساحة منظمة لفريقك لمتابعة المهام.
                                    </p>

                                    <form onSubmit={handleCreateGroup} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-black text-slate-900">اسم المجموعة</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="مثال: فريق التسويق"
                                                className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-0 transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-black text-slate-900">اسم الشركة (اختياري)</label>
                                            <input
                                                type="text"
                                                value={formData.company_name}
                                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                placeholder="اسم الشركة"
                                                className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-0 transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-black text-slate-900">الوصف</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={3}
                                                placeholder="وصف مختصر..."
                                                className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-0 transition-colors resize-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-black text-slate-900">تاريخ البدء</label>
                                                <input
                                                    type="date"
                                                    value={formData.start_date}
                                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-black text-slate-900">تاريخ الانتهاء</label>
                                                <input
                                                    type="date"
                                                    value={formData.end_date}
                                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                    className="w-full rounded-2xl border-slate-200 border-2 px-4 py-3.5 text-sm font-bold text-slate-900 focus:border-slate-900 focus:ring-0 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-3 pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="rounded-xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded-xl bg-slate-900 text-white px-8 py-3 text-sm font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95"
                                            >
                                                إنشاء المجموعة
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
