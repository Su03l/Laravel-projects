"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Calendar, User } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { arSA } from "date-fns/locale"; // Arabic locale for dates
import TaskModal from "@/components/TaskModal";
import toast from "react-hot-toast";

interface Task {
    id: number;
    title: string;
    priority: 'high' | 'medium' | 'low';
    due_date: string;
    assigned_to?: any;
    group_id?: number;
}

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const filteredTasks = tasks;

    const PriorityBadge = ({ priority }: { priority: string }) => {
        const styles = {
            high: "bg-red-50 text-red-700 border-red-200",
            medium: "bg-amber-50 text-amber-700 border-amber-200",
            low: "bg-slate-50 text-slate-700 border-slate-200",
        };

        const labels = {
            high: "عالية",
            medium: "متوسطة",
            low: "منخفضة"
        };

        return (
            <span className={clsx("text-xs font-bold px-2.5 py-1 rounded-full border", styles[priority as keyof typeof styles] || styles.low)}>
                {labels[priority as keyof typeof labels] || labels.low}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">إدارة المهام</h1>
                    <p className="text-slate-500 mt-1">تتبع مهامك وتعيينات الفريق.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm shadow-sky-200 hover:shadow-md"
                >
                    <Plus className="w-5 h-5" />
                    مهمة جديدة
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8 space-x-reverse">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={clsx(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors",
                            activeTab === 'personal'
                                ? "border-sky-500 text-sky-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        مهامي الشخصية
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={clsx(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm transition-colors",
                            activeTab === 'group'
                                ? "border-sky-500 text-sky-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        مهام المجموعات
                    </button>
                </nav>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="text-center py-12 text-slate-400">جاري تحميل المهام...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-slate-100 border-dashed">
                    <div className="text-slate-400 mb-3 text-lg">لا توجد مهام حالياً</div>
                    <button onClick={() => setIsModalOpen(true)} className="text-sky-500 hover:text-sky-600 font-bold transition-colors">أنشئ مهمتك الأولى</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="group bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all cursor-pointer flex flex-col md:flex-row gap-4 justify-between items-start md:items-center"
                        >
                            <div className="space-y-2 w-full md:w-auto">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{task.title}</h3>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy", { locale: arSA }) : "لا يوجد تاريخ"}
                                    </div>
                                    {task.group_id && (
                                        <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2 py-1 rounded-md border border-sky-100">
                                            <User className="w-4 h-4" />
                                            <span>مجموعة #{task.group_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-center w-full md:w-auto justify-end">
                                {/* Status Dot */}
                                <span className="text-xs font-medium text-slate-400">قيد الانتظار</span>
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchTasks}
            />
        </div>
    );
}
