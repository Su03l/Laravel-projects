"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    groupId?: number | null; // Pre-fill if in a group context
}

export default function TaskModal({ isOpen, onClose, onSuccess, groupId }: TaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        priority: "medium", // 'high', 'medium', 'low'
        due_date: "",
        group_id: groupId || "",
        assigned_to: "", // For now simple string or email, ideally a user selector
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            if (!formData.title) {
                toast.error("Title is required");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                group_id: formData.group_id ? Number(formData.group_id) : null,
            };

            await api.post("/tasks", payload);
            toast.success("Task created successfully!");
            onSuccess();
            onClose();
            // Reset form
            setFormData({
                title: "",
                priority: "medium",
                due_date: "",
                group_id: groupId || "",
                assigned_to: "",
            });
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-slate-900"
                                    >
                                        Create New Task
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-1 hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-slate-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Task Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="e.g. Redesign Homepage"
                                            className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                        />
                                    </div>

                                    {/* Priority & Due Date Row */}
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Priority
                                            </label>
                                            <select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Due Date
                                            </label>
                                            <input
                                                type="date"
                                                name="due_date"
                                                value={formData.due_date}
                                                onChange={handleChange}
                                                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Group (Optional/Hidden if pre-filled) */}
                                    {!groupId && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Group ID (Optional)
                                            </label>
                                            <input
                                                type="number"
                                                name="group_id"
                                                value={formData.group_id}
                                                onChange={handleChange}
                                                placeholder="Enter Group ID"
                                                className="w-full rounded-lg border-slate-300 border px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                            />
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-8 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="rounded-lg bg-sky-500 px-6 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:opacity-50 transition-all"
                                        >
                                            {loading ? "Creating..." : "Create Task"}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
