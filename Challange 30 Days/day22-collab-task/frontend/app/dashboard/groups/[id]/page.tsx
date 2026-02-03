"use client";

import { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { ArrowRight, Calendar, User, Plus, Trash2, Mail, Hash, CheckCircle, Clock, MoreVertical, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Dialog, Transition, Menu } from "@headlessui/react";
import TaskModal from "@/components/TaskModal";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
        high: "bg-rose-100 text-rose-700 ring-rose-200",
        medium: "bg-amber-100 text-amber-700 ring-amber-200",
        low: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    };

    const labels = { high: "أولوية عالية", medium: "متوسطة", low: "عادية" };

    return (
        <span className={clsx("text-xs font-extra-bold px-3 py-1.5 rounded-full ring-1 shadow-sm tracking-wide", styles[priority as keyof typeof styles] || styles.low)}>
            {labels[priority as keyof typeof labels] || labels.low}
        </span>
    );
};

interface Member {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    role: string;
}

interface Task {
    id: number;
    title: string;
    content?: string;
    priority: "low" | "medium" | "high";
    is_completed: boolean;
    start_date?: string;
    end_date?: string;
    assigned_to?: any;
    group_id?: number;
}

interface GroupDetails {
    id: number;
    name: string;
    description?: string;
    company_name?: string;
    start_date?: string;
    end_date?: string;
    is_owner: boolean;
    members: Member[];
    tasks: Task[];
}

export default function GroupDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = Number(params.id);

    const [group, setGroup] = useState<GroupDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [emailToAdd, setEmailToAdd] = useState("");

    // Task Modal State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const fetchGroupDetails = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/groups/${groupId}`);
            setGroup(res.data.group);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "فشل تحميل تفاصيل الخطة");
            router.push("/dashboard/groups");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (groupId) fetchGroupDetails();
    }, [groupId]);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/groups/${groupId}/members`, { email: emailToAdd });
            toast.success("تم إضافة العضو بنجاح");
            setIsAddMemberOpen(false);
            setEmailToAdd("");
            fetchGroupDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل إضافة العضو");
        }
    };

    const handleRemoveMember = async (userId: number) => {
        if (!confirm("هل أنت متأكد من حذف هذا العضو؟")) return;
        try {
            await api.delete(`/groups/${groupId}/members/${userId}`);
            toast.success("تم حذف العضو");
            fetchGroupDetails();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "فشل حذف العضو");
        }
    };

    // --- Task Handlers --- (Similar to TasksPage but tailored)
    const handleTaskSuccess = () => {
        fetchGroupDetails(); // Reload group to see new/updated tasks
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsTaskModalOpen(true);
    };

    const handleViewTask = (task: Task) => {
        setViewingTaskId(task.id);
        setIsTaskDetailsOpen(true);
    };

    const getAvatarUrl = (url: string | null) => {
        if (!url) return null;
        return url.startsWith('http') ? url : `http://localhost:8000${url}`;
    };

    if (loading) return <div className="p-10 text-center text-slate-500">جاري التحميل...</div>;
    if (!group) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Header / Info */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold mb-6 transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                    <span>عودة للمجموعات</span>
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{group.name}</h1>
                            {group.company_name && (
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                                    {group.company_name}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl leading-relaxed">
                            {group.description || "لا يوجد وصف."}
                        </p>

                        <div className="flex items-center gap-6 mt-6 text-sm font-bold text-slate-500">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{group.start_date || "---"}</span>
                                <span className="text-slate-300">→</span>
                                <span>{group.end_date || "---"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                <span>{group.members.length} أعضاء</span>
                            </div>
                        </div>
                    </div>

                    {group.is_owner && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsAddMemberOpen(true)}
                                className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                                <span>إضافة عضو</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Members Column */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900">الأعضاء</h2>
                        <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-bold">{group.members.length}</span>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm space-y-4">
                        {group.members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between group p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden border-2 border-white shadow-sm">
                                        {getAvatarUrl(member.avatar) ? (
                                            <img src={getAvatarUrl(member.avatar)!} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            member.name[0]
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{member.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{member.email}</p>
                                    </div>
                                </div>

                                {group.is_owner && member.role !== 'admin' && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                {member.role === 'admin' && (
                                    <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">مسؤول</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tasks Column */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900">مهام المجموعة</h2>
                        <button
                            onClick={handleCreateTask}
                            className="text-sky-600 font-bold hover:bg-sky-50 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>مهمة جديدة</span>
                        </button>
                    </div>

                    {group.tasks.length === 0 ? (
                        <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <p className="text-slate-500 font-bold">لا توجد مهام في هذه المجموعة بعد.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {group.tasks.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                                    className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                                >
                                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-2 bg-slate-50 rounded-full text-slate-400">
                                            <Edit2 className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <PriorityBadge priority={task.priority} />

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditTask(task);
                                                }}
                                                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <h3 className={clsx("text-2xl font-black mb-3 leading-tight transition-colors", task.is_completed ? "text-slate-400 line-through" : "text-slate-900 group-hover:text-sky-600")}>
                                            {task.title}
                                        </h3>
                                        <p className={clsx("text-base font-medium line-clamp-3 mb-6", task.is_completed ? "text-slate-300" : "text-slate-500")}>
                                            {task.content || "لا يوجد وصف إضافي لهذه المهمة..."}
                                        </p>
                                    </div>

                                    <div className="pt-6 border-t border-slate-50 mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-sm font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg flex-wrap">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span>
                                                    {task.start_date ? format(new Date(task.start_date), "d MMM", { locale: arSA }) : "..."}
                                                    <span className="mx-1 text-slate-300">→</span>
                                                    {task.end_date ? format(new Date(task.end_date), "d MMM", { locale: arSA }) : "بلا تاريخ"}
                                                </span>
                                            </div>

                                            {task.assigned_to && (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden" title={task.assigned_to.name}>
                                                    {getAvatarUrl(task.assigned_to.avatar) ? (
                                                        <img src={getAvatarUrl(task.assigned_to.avatar)!} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-xs font-bold text-slate-500">
                                                            {task.assigned_to.name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className={clsx(
                                            "w-full py-3.5 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-3 shadow-sm",
                                            task.is_completed
                                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                                : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20"
                                        )}>
                                            {task.is_completed ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>مكتملة</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-5 h-5" />
                                                    <span>قيد التنفيذ</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            <Transition appear show={isAddMemberOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsAddMemberOpen(false)} dir="rtl">
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl transition-all">
                                <Dialog.Title as="h3" className="text-2xl font-black text-slate-900 mb-2">
                                    إضافة عضو
                                </Dialog.Title>
                                <p className="text-slate-500 text-sm mb-6">أدخل البريد الإلكتروني للشخص الذي تريد دعوته.</p>

                                <form onSubmit={handleAddMember} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            value={emailToAdd}
                                            onChange={(e) => setEmailToAdd(e.target.value)}
                                            placeholder="example@email.com"
                                            className="w-full rounded-xl border-slate-200 border-2 px-4 py-3 pr-12 text-sm font-bold focus:border-slate-900 focus:ring-0"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddMemberOpen(false)}
                                            className="flex-1 rounded-xl py-3 text-sm font-bold text-slate-500 hover:bg-slate-50"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 rounded-xl bg-slate-900 text-white py-3 text-sm font-bold hover:bg-slate-800 shadow-lg"
                                        >
                                            إضافة
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Task Modal (Reuse) */}
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={handleTaskSuccess}
                groupId={groupId} // Pass Group ID here implies "Add to this Group"
                task={selectedTask}
            />
        </div>
    );
}
