"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X, Send, Paperclip, FileText, User, Calendar, Clock, Download, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import clsx from "clsx";

interface TaskDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskId: number | null;
    onTaskUpdate: () => void;
}

export default function TaskDetailsModal({ isOpen, onClose, taskId, onTaskUpdate }: TaskDetailsModalProps) {
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [commentBody, setCommentBody] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const fetchTaskDetails = async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            const res = await api.get(`/tasks/${taskId}`);
            setTask(res.data.task);
        } catch (error) {
            toast.error("فشل تحميل تفاصيل المهمة");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && taskId) {
            fetchTaskDetails();
        } else {
            setTask(null);
        }
    }, [isOpen, taskId]);

    const handleSendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentBody.trim()) return;

        try {
            await api.post(`/tasks/${taskId}/comments`, { body: commentBody });
            setCommentBody("");
            fetchTaskDetails(); // Refresh to show new comment
        } catch (error) {
            toast.error("فشل إرسال التعليق");
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
            fetchTaskDetails();
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

    if (!isOpen) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose} dir="rtl">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[2rem] bg-white shadow-2xl transition-all flex flex-col md:flex-row max-h-[90vh]">

                                {loading || !task ? (
                                    <div className="p-10 w-full text-center text-slate-500">جاري التحميل...</div>
                                ) : (
                                    <>
                                        {/* Left Side: Task Info (On Desktop, it's right side due to RTL) */}
                                        <div className="flex-1 p-8 overflow-y-auto border-l border-slate-100">
                                            <div className="flex justify-between items-start mb-6">
                                                <Dialog.Title as="h3" className="text-3xl font-black text-slate-900 leading-snug">
                                                    {task.title}
                                                </Dialog.Title>
                                                <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                                                    <X className="w-6 h-6" />
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-6">
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-bold",
                                                    task.priority === 'high' ? "bg-rose-100 text-rose-700" :
                                                        task.priority === 'medium' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                                                )}>
                                                    {task.priority === 'high' ? "أولوية عالية" : task.priority === 'medium' ? "أولوية متوسطة" : "أولوية عادية"}
                                                </span>
                                                <span className={clsx(
                                                    "px-3 py-1 rounded-full text-xs font-bold",
                                                    task.is_completed ? "bg-slate-100 text-slate-500 line-through" : "bg-sky-100 text-sky-700"
                                                )}>
                                                    {task.is_completed ? "مكتملة" : "قيد العمل"}
                                                </span>
                                            </div>

                                            <p className="text-slate-800 font-medium text-lg leading-relaxed mb-8">
                                                {task.content || "لا يوجد وصف لهذه المهمة."}
                                            </p>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-500" />
                                                    <span>تاريخ البدء:</span>
                                                    <span className="text-slate-900">{task.start_date || "---"}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                                                    <Clock className="w-4 h-4 text-slate-500" />
                                                    <span>تاريخ الانتهاء:</span>
                                                    <span className="text-slate-900">{task.end_date || "---"}</span>
                                                </div>
                                                {task.assignee && (
                                                    <div className="flex items-center gap-3 mt-6 p-4 bg-slate-50 rounded-2xl">
                                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 overflow-hidden flex items-center justify-center text-slate-500 text-xs font-bold">
                                                            {getAvatarUrl(task.assignee.avatar) ? (
                                                                <img src={getAvatarUrl(task.assignee.avatar)!} className="w-full h-full object-cover" />
                                                            ) : task.assignee.first_name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-500 font-bold mb-0.5">مسندة إلى</p>
                                                            <p className="text-sm font-bold text-slate-900">{task.assignee.first_name} {task.assignee.last_name}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Attachments Section */}
                                            <div className="mt-10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                                        <Paperclip className="w-5 h-5 text-slate-400" />
                                                        المرفقات
                                                    </h4>
                                                    <label className="cursor-pointer text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-1">
                                                        <span className="mb-0.5">+ رفع ملف</span>
                                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                                    </label>
                                                </div>

                                                <div className="space-y-2">
                                                    {task.attachments?.map((att: any) => (
                                                        <div key={att.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{att.file_name}</span>
                                                                    <span className="text-[10px] text-slate-400">{format(new Date(att.created_at), "d MMM yyyy")}</span>
                                                                </div>
                                                            </div>
                                                            <a href={`http://localhost:8000/storage/${att.file_path}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-300 hover:text-sky-600 transition-colors">
                                                                <Download className="w-4 h-4" />
                                                            </a>
                                                        </div>
                                                    ))}
                                                    {(!task.attachments || task.attachments.length === 0) && (
                                                        <p className="text-sm text-slate-400 italic">لا توجد مرفقات.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Comments (On Desktop, it's left side due to RTL) */}
                                        <div className="w-full md:w-[400px] bg-slate-50 p-8 flex flex-col h-[500px] md:h-auto">
                                            <h4 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                                المحادثة
                                                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{task.comments?.length || 0}</span>
                                            </h4>

                                            <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-200">
                                                {task.comments?.map((comment: any) => (
                                                    <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">
                                                            {getAvatarUrl(comment.user.avatar) ? (
                                                                <img src={getAvatarUrl(comment.user.avatar)!} className="w-full h-full object-cover" />
                                                            ) : comment.user.first_name[0]}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-baseline gap-2 mb-1">
                                                                <span className="text-sm font-black text-slate-800">{comment.user.first_name}</span>
                                                                <span className="text-[10px] text-slate-400">{format(new Date(comment.created_at), "h:mm a")}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-800 bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-slate-100">
                                                                {comment.body}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(!task.comments || task.comments.length === 0) && (
                                                    <div className="text-center py-10 text-slate-400 text-sm font-medium">
                                                        كن أول من يعلق على هذه المهمة.
                                                    </div>
                                                )}
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
                                    </>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
