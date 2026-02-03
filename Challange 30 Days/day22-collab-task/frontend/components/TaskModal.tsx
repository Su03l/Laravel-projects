"use client";

import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Calendar, Flag, FileText, Type, Hash, Trash2, CheckCircle, Clock } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface Task {
    id: number;
    title: string;
    content?: string;
    priority: "low" | "medium" | "high";
    start_date?: string;
    end_date?: string;
    group_id?: number | null;
    assigned_to?: any;
    is_completed: boolean;
    user_id?: number;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    groupId?: number | null;
    task?: Task | null; // If provided, we are in Edit/View mode
}

export default function TaskModal({ isOpen, onClose, onSuccess, groupId, task }: TaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        priority: "medium",
        start_date: "",
        end_date: "",
        group_id: groupId || "",
        assigned_to: "",
    });

    // Load task data when modal opens or task changes
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                content: task.content || "",
                priority: task.priority,
                start_date: task.start_date || "",
                end_date: task.end_date || "",
                group_id: task.group_id || groupId || "",
                assigned_to: task.assigned_to?.id || "",
            });
        } else {
            // Reset for create mode
            setFormData({
                title: "",
                content: "",
                priority: "medium",
                start_date: "",
                end_date: "",
                group_id: groupId || "",
                assigned_to: "",
            });
        }
    }, [task, groupId, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);

        try {
            if (!formData.title) {
                toast.error("عنوان المهمة مطلوب");
                setLoading(false);
                return;
            }

            // Create payload explicitly to avoid any extra data
            const payload = {
                title: formData.title,
                content: formData.content,
                priority: formData.priority,
                group_id: formData.group_id ? Number(formData.group_id) : null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                assigned_to: formData.assigned_to || null,
            };

            if (task) {
                await api.put(`/tasks/${task.id}`, payload);
                toast.success("تم تحديث المهمة بنجاح!");
            } else {
                await api.post("/tasks", payload);
                toast.success("تم إنشاء المهمة بنجاح!");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Task submission error:", error);
            const msg = error.response?.data?.message || "فشل حفظ المهمة";
            toast.error(typeof msg === 'string' ? msg : "حدث خطأ غير متوقع");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;
        if (!confirm("هل أنت متأكد من حذف هذه المهمة؟")) return;

        setLoading(true);
        try {
            await api.delete(`/tasks/${task.id}`);
            toast.success("تم حذف المهمة");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حذف المهمة");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        if (!task) return;
        setLoading(true);
        try {
            await api.put(`/tasks/${task.id}`, {
                is_completed: !task.is_completed
            });
            toast.success(task.is_completed ? "تم إعادة فتح المهمة" : "تم إكمال المهمة");
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error("فشل تغيير الحالة");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50 text-right" onClose={onClose} dir="rtl">
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-4"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-4"
                        >
                            <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 text-right align-middle shadow-2xl transition-all font-sans relative border border-slate-100">

                                {/* Header */}
                                <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-4">
                                    <div>
                                        <Dialog.Title as="h3" className="text-2xl font-extrabold leading-6 text-slate-900 tracking-tight">
                                            {task ? "تفاصيل المهمة" : "مهمة جديدة"}
                                        </Dialog.Title>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {task ? "عرض وتعديل تفاصيل المهمة" : "أضف تفاصيل المهمة للفريق"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-2 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Title */}
                                    <div className="relative group">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            عنوان المهمة
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <Type className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="مثال: تحديث الصفحة الرئيسية"
                                                className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-bold text-black placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Content (Description) */}
                                    <div className="relative group">
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            التفاصيل (اختياري)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 right-0 pr-3 flex items-start pointer-events-none">
                                                <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                            </div>
                                            <textarea
                                                name="content"
                                                value={formData.content}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="أضف وصفاً تفصيلياً للمهمة..."
                                                className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-bold text-black placeholder:text-slate-400 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Priority & Status */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                الأولوية
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-10">
                                                    <Flag className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <select
                                                    name="priority"
                                                    value={formData.priority}
                                                    onChange={handleChange}
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-bold text-black appearance-none"
                                                >
                                                    <option value="low">منخفضة</option>
                                                    <option value="medium">متوسطة</option>
                                                    <option value="high">عالية</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Status Button (Only in Edit Mode) */}
                                        {task && (
                                            <div className="flex items-end">
                                                <button
                                                    type="button"
                                                    onClick={toggleStatus}
                                                    className={`w-full rounded-2xl border px-4 py-3 text-sm font-bold transition-all flex items-center justify-center gap-2 ${task.is_completed
                                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                                                        : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                                                        }`}
                                                >
                                                    {task.is_completed ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                                    {task.is_completed ? "مكتملة" : "قيد التنفيذ"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Dates Row */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                تاريخ البدء
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="start_date"
                                                    value={formData.start_date}
                                                    onChange={handleChange}
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-bold text-black"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                تاريخ الانتهاء
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="date"
                                                    name="end_date"
                                                    value={formData.end_date}
                                                    onChange={handleChange}
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-bold text-black"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Group (Optional/Hidden if pre-filled) */}
                                    {!groupId && !task?.group_id && (
                                        <div className="relative group">
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                رقم المجموعة (اختياري)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <Hash className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                                                </div>
                                                <input
                                                    type="number"
                                                    name="group_id"
                                                    value={formData.group_id}
                                                    onChange={handleChange}
                                                    placeholder="أدخل رقم المجموعة"
                                                    className="w-full rounded-2xl border-slate-200 border px-4 py-3 pr-10 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 bg-slate-50 focus:bg-white transition-all font-bold text-black"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-50">

                                        {/* Delete Button (Only in Edit Mode) */}
                                        {task ? (
                                            <button
                                                type="button"
                                                onClick={handleDelete}
                                                className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 p-3 rounded-xl transition-all"
                                                title="حذف المهمة"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        ) : <div></div>}

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="rounded-xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                                            >
                                                إلغاء
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSubmit}
                                                disabled={loading}
                                                className="rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-8 py-3 text-sm font-bold text-white hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 disabled:opacity-50 transition-all shadow-lg shadow-sky-200 transform hover:-translate-y-0.5"
                                            >
                                                {loading ? "جاري الحفظ..." : (task ? "حفظ التغييرات" : "إنشاء المهمة")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
