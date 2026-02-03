"use client";

import { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ArrowLeft, ArrowRight, Calendar, Clock, User, CheckCircle, Paperclip, FileText, Download, Send, Edit2, Trash2, MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { Menu, Transition } from "@headlessui/react";
import TaskModal from "@/components/TaskModal";

export default function TaskPage() {
    const params = useParams();
    const router = useRouter();
    const taskId = Number(params.id);

    const [task, setTask] = useState<any>(null);
    const [permissions, setPermissions] = useState<any>({ can_edit: false, can_delete: false, role: null });
    const [loading, setLoading] = useState(true);
    const [commentBody, setCommentBody] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Edit Comment State
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editCommentBody, setEditCommentBody] = useState("");

    const fetchTask = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/tasks/${taskId}`);
            setTask(res.data.task);
            setPermissions(res.data.permissions);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تحميل المهمة");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (taskId) fetchTask();
    }, [taskId]);

    const handleToggleStatus = async () => {
        try {
            await api.put(`/tasks/${taskId}`, { is_completed: !task.is_completed });
            toast.success(task.is_completed ? "تم إعادة فتح المهمة" : "تم إكمال المهمة");
            fetchTask();
        } catch (error) {
            toast.error("فشل تحديث الحالة");
        }
    };

    const handleDeleteTask = async () => {
        if (!confirm("هل أنت متأكد من حذف هذه المهمة نهائياً؟")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success("تم حذف المهمة");
            router.back();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حذف المهمة");
        }
    };

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentBody.trim()) return;

        try {
            await api.post(`/tasks/${taskId}/comments`, { body: commentBody });
            setCommentBody("");
            fetchTask();
        } catch (error) {
            toast.error("فشل إرسال التعليق");
        }
    };

    const handleUpdateComment = async (commentId: number) => {
        if (!editCommentBody.trim()) return;
        try {
            await api.put(`/comments/${commentId}`, { body: editCommentBody });
            toast.success("تم تعديل التعليق");
            setEditingCommentId(null);
            fetchTask();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل تعديل التعليق");
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm("هل أنت متأكد؟")) return;
        try {
            await api.delete(`/comments/${commentId}`);
            toast.success("تم حذف التعليق");
            fetchTask();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حذف التعليق");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            await api.post(`/tasks/${taskId}/attachments`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("تم رفع الملف");
            fetchTask();
        } catch (error) {
            toast.error("فشل رفع الملف");
        } finally {
            setIsUploading(false);
        }
    };

    const getAvatarUrl = (url: string | null) => {
        if (!url) return null;
        return url.startsWith("http") ? url : `http://localhost:8000${url}`;
    };

    if (loading) return <div className="p-10 text-center text-slate-500">جاري التحميل...</div>;
    if (!task) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header */}
            {/* Header Redesigned */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50">
                {/* Top Row: Back & Actions */}
                <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    {/* Right Side (in RTL): Back Button */}
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors">
                        <ArrowRight className="w-5 h-5" />
                        <span>عودة</span>
                    </button>

                    {/* Left Side (in RTL): Actions & Status */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                        {permissions.can_edit && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="p-2 text-slate-400 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors"
                                    title="تعديل المهمة"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                {permissions.can_delete && (
                                    <button
                                        onClick={handleDeleteTask}
                                        className="p-2 text-rose-400 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                                        title="حذف المهمة"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleToggleStatus}
                            className={clsx(
                                "px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 text-sm",
                                task.is_completed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-900 text-white hover:bg-slate-800"
                            )}
                        >
                            {task.is_completed ? <><CheckCircle className="w-4 h-4" /> مكتملة</> : <><Clock className="w-4 h-4" /> قيد التنفيذ</>}
                        </button>
                    </div>
                </div>

                {/* Main Content Row */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 space-y-4">
                        <h1 className={clsx("text-3xl md:text-4xl font-black text-slate-900 leading-tight", task.is_completed && "line-through opacity-50")}>
                            {task.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-xs font-bold border",
                                task.priority === 'high' ? "bg-rose-50 text-rose-700 border-rose-100" :
                                    task.priority === 'medium' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            )}>
                                {task.priority === 'high' ? "أولوية عالية" : task.priority === 'medium' ? "أولوية متوسطة" : "أولوية عادية"}
                            </span>

                            {task.group && (
                                <span className="bg-slate-50 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-slate-100">
                                    <User className="w-3 h-3" />
                                    {task.group.name}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Metadata Side */}
                    <div className="flex flex-col gap-3 min-w-[200px] border-r-2 border-slate-50 pr-6 mr-6 md:mr-0 md:border-r-0 md:border-l-2 md:pl-6">
                        <div className="flex items-center gap-3 text-slate-500">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div className="flex flex-col text-xs font-bold">
                                <span className="text-slate-400">تاريخ البدء</span>
                                <span>{task.start_date || "غير محدد"}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <div className="flex flex-col text-xs font-bold">
                                <span className="text-slate-400">تاريخ الانتهاء</span>
                                <span>{task.end_date || "غير محدد"}</span>
                            </div>
                        </div>

                        {task.assignee && (
                            <div className="flex items-center gap-3 pt-2 mt-2 border-t border-slate-50">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs overflow-hidden ring-2 ring-white shadow-sm">
                                    {getAvatarUrl(task.assignee.avatar) ? (
                                        <img src={getAvatarUrl(task.assignee.avatar)!} className="w-full h-full object-cover" alt={task.assignee.first_name} />
                                    ) : task.assignee.first_name[0]}
                                </div>
                                <div className="flex flex-col text-xs font-bold">
                                    <span className="text-slate-400">المسؤول</span>
                                    <span className="text-slate-800">{task.assignee.first_name} {task.assignee.last_name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Content & Attachments */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-black text-slate-900 mb-4">التفاصيل</h2>
                        <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                            {task.content || "لا يوجد وصف."}
                        </p>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Paperclip className="w-5 h-5 text-slate-400" />
                                المرفقات
                            </h2>
                            <label className="cursor-pointer text-sm font-bold bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                                <span className="mb-0.5">+ رفع ملف</span>
                                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                            </label>
                        </div>
                        <div className="space-y-3">
                            {task.attachments?.map((att: any) => (
                                <div key={att.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{att.file_name}</span>
                                            <span className="text-xs text-slate-400">{format(new Date(att.created_at), "d MMM yyyy")}</span>
                                        </div>
                                    </div>
                                    <a href={`http://localhost:8000/storage/${att.file_path}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-sky-600 transition-colors">
                                        <Download className="w-5 h-5" />
                                    </a>
                                </div>
                            ))}
                            {(!task.attachments || task.attachments.length === 0) && (
                                <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                                    لا توجد مرفقات
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col h-[600px]">
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            المحادثة
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{task.comments?.length || 0}</span>
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-200">
                            {task.comments?.map((comment: any) => (
                                <div key={comment.id} className="group">
                                    <div className="flex gap-3 mb-1">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                                            {getAvatarUrl(comment.user.avatar) ? (
                                                <img src={getAvatarUrl(comment.user.avatar)!} className="w-full h-full object-cover" />
                                            ) : comment.user.first_name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm font-black text-slate-800">{comment.user.first_name}</span>
                                                    <span className="text-[10px] text-slate-400">{format(new Date(comment.created_at), "h:mm a")}</span>
                                                </div>

                                                {/* Edit/Delete Menu for Owner OR Admin */}
                                                <Menu as="div" className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {(permissions.role === 'admin' || comment.user_id === Number(localStorage.getItem('user_id'))) && (
                                                        <>
                                                            <Menu.Button className="p-1 text-slate-300 hover:text-slate-600">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </Menu.Button>
                                                            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                                                <Menu.Items className="absolute left-0 mt-1 w-32 origin-top-left bg-white rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none z-10 text-xs font-bold overflow-hidden">
                                                                    {/* Owner can edit */}
                                                                    {comment.user_id === Number(localStorage.getItem('user_id')) && (
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => { setEditingCommentId(comment.id); setEditCommentBody(comment.body); }} className={clsx(active ? 'bg-slate-50' : '', 'block w-full text-right px-4 py-2 text-slate-700')}>
                                                                                    تعديل
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                    )}
                                                                    {/* Owner OR Admin can delete */}
                                                                    {(comment.user_id === Number(localStorage.getItem('user_id')) || permissions.role === 'admin') && (
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => handleDeleteComment(comment.id)} className={clsx(active ? 'bg-rose-50 text-rose-600' : 'text-rose-600', 'block w-full text-right px-4 py-2')}>
                                                                                    حذف
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                    )}
                                                                </Menu.Items>
                                                            </Transition>
                                                        </>
                                                    )}
                                                </Menu>
                                            </div>

                                            {editingCommentId === comment.id ? (
                                                <div className="mt-2">
                                                    <textarea
                                                        value={editCommentBody}
                                                        onChange={(e) => setEditCommentBody(e.target.value)}
                                                        className="w-full text-sm p-2 border rounded-xl mb-2"
                                                        autoFocus
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleUpdateComment(comment.id)} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg">حفظ</button>
                                                        <button onClick={() => setEditingCommentId(null)} className="text-xs text-slate-500 px-3 py-1.5">إلغاء</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-2xl rounded-tr-none mt-1">
                                                    {comment.body}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendComment} className="relative mt-auto">
                            <input
                                type="text"
                                value={commentBody}
                                onChange={(e) => setCommentBody(e.target.value)}
                                placeholder="اكتب تعليقاً..."
                                className="w-full rounded-2xl border-slate-200 border-2 pl-12 pr-4 py-3 text-sm font-bold focus:border-slate-900 focus:ring-0 shadow-sm"
                            />
                            <button
                                type="submit"
                                disabled={!commentBody.trim()}
                                className="absolute left-2 top-2 p-1.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>


            <TaskModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchTask}
                task={task}
                groupId={task.group_id}
            />
        </div >
    );
}
