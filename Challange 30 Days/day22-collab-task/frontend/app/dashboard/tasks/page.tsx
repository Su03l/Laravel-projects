"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Calendar, User, Clock, CheckCircle, MoreVertical, Edit2, Trash2, ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import TaskModal from "@/components/TaskModal";
import toast from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface Task {
    id: number;
    title: string;
    content?: string;
    priority: 'high' | 'medium' | 'low';
    start_date?: string;
    end_date?: string;
    group_id?: number | null;
    assigned_to?: any;
    is_completed: boolean;
    user_id?: number;
}

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tasks');
            const data = Array.isArray(response.data) ? response.data : response.data.data;
            setTasks(data || []);
        } catch (error) {
            console.error(error);
            toast.error("فشل تحميل المهام");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [activeTab]);

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'personal') return !task.group_id;
        return task.group_id;
    });

    const handleDeleteTask = async (e: React.MouseEvent, taskId: number) => {
        e.stopPropagation();
        if (!confirm("هل أنت متأكد من حذف هذه المهمة؟")) return;

        try {
            await api.delete(`/tasks/${taskId}`);
            toast.success("تم حذف المهمة");
            fetchTasks();
        } catch (error) {
            toast.error("فشل حذف المهمة");
        }
    };

    const handleToggleStatus = async (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        try {
            await api.put(`/tasks/${task.id}`, { is_completed: !task.is_completed });
            toast.success(task.is_completed ? "تم إعادة فتح المهمة" : "تم إكمال المهمة");
            fetchTasks();
        } catch (error) {
            toast.error("فشل تحديث الحالة");
        }
    };

    const handleEditTask = (e: React.MouseEvent, task: Task) => {
        e.stopPropagation();
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const PriorityBadge = ({ priority }: { priority: string }) => {
        const styles = {
            high: "bg-rose-100 text-rose-700 ring-rose-200",
            medium: "bg-amber-100 text-amber-700 ring-amber-200",
            low: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        };

        const labels = { high: "أولوية عالية", medium: "متوسطة", low: "عادية" };

        return (
            <span className={clsx("text-xs font-extra-bold px-3 py-1.5 rounded-full ring-1 shadow-sm tracking-wide", styles[priority as keyof typeof styles])}>
                {labels[priority as keyof typeof labels] || labels.low}
            </span>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header Section (Reverted to White as requested) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">إدارة المهام</h1>
                    <p className="text-slate-500 text-lg font-medium">
                        نظّم وقتك، أنجز مهامك، وحقق أهدافك بكفاءة عالية.
                    </p>
                </div>
                <button
                    onClick={handleCreateTask}
                    className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>مهمة جديدة</span>
                </button>
            </div>

            {/* Custom Tabs */}
            <div className="flex justify-center">
                <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-slate-100 inline-flex">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={clsx(
                            "px-8 py-3 rounded-xl text-base font-bold transition-all duration-300",
                            activeTab === 'personal'
                                ? "bg-slate-900 text-white shadow-md scale-105"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        مهامي الشخصية
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={clsx(
                            "px-8 py-3 rounded-xl text-base font-bold transition-all duration-300",
                            activeTab === 'group'
                                ? "bg-slate-900 text-white shadow-md scale-105"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                        )}
                    >
                        مهام المجموعات
                    </button>
                </div>
            </div>

            {/* Task Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-72 rounded-3xl bg-slate-100 animate-pulse"></div>
                    ))}
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm border-dashed text-center px-4">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 mb-2">القائمة خالية تماماً!</h3>
                    <p className="text-slate-500 text-lg max-w-md mb-8">
                        رائع! لقد أنجزت كل شيء. خذ استراحة أو ابدأ بإضافة مهام جديدة لزيادة إنتاجيتك.
                    </p>
                    <button onClick={handleCreateTask} className="text-sky-600 text-lg font-bold hover:underline flex items-center gap-2">
                        <span>إضافة مهمة جديدة</span>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => { setSelectedTask(task); setIsModalOpen(true); }}
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

                                    <Menu as="div" className="relative">
                                        <Menu.Button
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                        >
                                            <MoreVertical className="w-6 h-6" />
                                        </Menu.Button>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left divide-y divide-slate-100 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none z-20">
                                                <div className="p-1.5 space-y-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={(e) => handleEditTask(e, task)}
                                                                className={clsx(
                                                                    active ? 'bg-sky-50 text-sky-600' : 'text-slate-700',
                                                                    'group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors'
                                                                )}
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                تعديل
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={(e) => handleDeleteTask(e, task.id)}
                                                                className={clsx(
                                                                    active ? 'bg-rose-50 text-rose-600' : 'text-slate-700',
                                                                    'group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors'
                                                                )}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                حذف
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
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

                                    {task.group_id && (
                                        <div className="flex items-center gap-2 text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1.5 rounded-lg">
                                            <User className="w-4 h-4" />
                                            <span>مجموعة</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => handleToggleStatus(e, task)}
                                    className={clsx(
                                        "w-full py-3.5 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-center gap-3 shadow-sm",
                                        task.is_completed
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                            : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20"
                                    )}
                                >
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
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTasks}
                task={selectedTask}
            />
        </div>
    );
}
