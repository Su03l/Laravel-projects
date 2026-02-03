"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Plus, Calendar, Flag, User } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import TaskModal from "@/components/TaskModal";
import toast from "react-hot-toast";

interface Task {
    id: number;
    title: string;
    priority: 'high' | 'medium' | 'low';
    due_date: string;
    assigned_to?: any; // Adjust based on API response
    group_id?: number;
}

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to fetch tasks
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await api.get('/tasks');
            // Assuming response.data is an array or { data: Array }
            const data = Array.isArray(response.data) ? response.data : response.data.data;
            setTasks(data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [activeTab]); // Refetch on tab change if logic differs later

    const filteredTasks = tasks; // Add filtering logic here if needed based on activeTab

    const PriorityBadge = ({ priority }: { priority: string }) => {
        const styles = {
            high: "bg-red-100 text-red-700 border-red-200",
            medium: "bg-amber-100 text-amber-700 border-amber-200",
            low: "bg-slate-100 text-slate-700 border-slate-200",
        };
        return (
            <span className={clsx("text-xs font-semibold px-2.5 py-0.5 rounded-full border", styles[priority as keyof typeof styles] || styles.low)}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
                    <p className="text-slate-500">Track your pending items and team assignments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-sky-200"
                >
                    <Plus className="w-5 h-5" />
                    New Task
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={clsx(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'personal'
                                ? "border-sky-500 text-sky-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        My Personal Tasks
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={clsx(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                            activeTab === 'group'
                                ? "border-sky-500 text-sky-600"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        Group Tasks
                    </button>
                </nav>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-100 border-dashed">
                    <div className="text-slate-400 mb-2">No tasks found</div>
                    <button onClick={() => setIsModalOpen(true)} className="text-sky-500 hover:underline text-sm font-medium">Create your first task</button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="group bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-100 transition-all cursor-pointer flex flex-col md:flex-row gap-4 justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">{task.title}</h3>
                                    <PriorityBadge priority={task.priority} />
                                </div>
                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        {task.due_date ? format(new Date(task.due_date), "MMM d, yyyy") : "No Date"}
                                    </div>
                                    {task.group_id && (
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-4 h-4 text-slate-400" />
                                            <span className="bg-slate-50 px-2 py-0.5 rounded text-xs border border-slate-200">Group #{task.group_id}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-start md:self-center">
                                {/* Actions or Status can go here */}
                                <div className="w-2 h-2 rounded-full bg-slate-200"></div>
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
