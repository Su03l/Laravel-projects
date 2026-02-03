"use client";

import { useEffect, useState, Fragment } from "react";
import api from "@/lib/axios";
import { Plus, Users, Calendar, Trash2 } from "lucide-react";
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
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Group Form State
    const [formData, setFormData] = useState({
        name: "",
        company_name: "",
        start_date: "",
        end_date: "",
    });

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await api.get('/groups');
            // Adjust based on API structure, assuming standard Laravel Resource default
            const data = Array.isArray(response.data.data) ? response.data.data : response.data;
            setGroups(data || []);
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
            setFormData({ name: "", company_name: "", start_date: "", end_date: "" });
            fetchGroups();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل إنشاء المجموعة");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">المجموعات</h1>
                    <p className="text-slate-500 mt-1">تعاون مع فريقك في مساحات عمل مخصصة.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm shadow-sky-200"
                >
                    <Plus className="w-5 h-5" />
                    مجموعة جديدة
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">جاري تحميل المجموعات...</div>
            ) : groups.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-100 border-dashed">
                    <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <div className="text-slate-900 font-medium mb-1">لا توجد مجموعات</div>
                    <p className="text-slate-500 mb-4 text-sm">ابدأ بإنشاء مساحة عمل لفريقك.</p>
                    <button onClick={() => setIsModalOpen(true)} className="text-sky-500 hover:text-sky-600 font-bold transition-colors">إنشاء مجموعة</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600 font-bold text-xl border border-sky-100">
                                        {group.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    {/* Menu or options could go here */}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{group.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">{group.company_name}</p>

                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>{group.start_date} - {group.end_date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span>{group.members_count || 0} أعضاء</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                                <button className="text-sm font-medium text-sky-600 hover:text-sky-700">عرض التفاصيل &larr;</button>
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
                        <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-slate-900 mb-4">
                                    إنشاء مجموعة جديدة
                                </Dialog.Title>
                                <form onSubmit={handleCreateGroup} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم المجموعة</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم الشركة</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.company_name}
                                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ البدء</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.start_date}
                                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">تاريخ الانتهاء</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.end_date}
                                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-medium text-white hover:bg-sky-600"
                                        >
                                            إنشاء
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
