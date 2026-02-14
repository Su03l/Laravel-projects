import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, User } from '@/types/models';
import { Calendar, MessageSquare, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskModal from './TaskModal';

interface TaskCardProps {
    task: Task;
    members: User[];
}

export default function TaskCard({ task, members }: TaskCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 bg-zinc-800 p-4 rounded-xl border border-indigo-500/50 shadow-2xl rotate-2 cursor-grabbing"
            />
        );
    }

    const priorityConfig = {
        low: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'عادي' },
        medium: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'متوسط' },
        high: { color: 'bg-rose-500/10 text-rose-400 border-rose-500/20', label: 'عاجل' },
    };

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={() => setIsModalOpen(true)}
                className="group bg-[#121214] p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 cursor-grab active:cursor-grabbing relative overflow-hidden"
            >
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded font-medium border", priorityConfig[task.priority].color)}>
                            {priorityConfig[task.priority].label}
                        </span>
                        {task.due_date && (
                             <span className={cn(
                                 "text-[10px] flex items-center gap-1.5",
                                 new Date(task.due_date) < new Date() ? "text-rose-400 font-bold" : "text-zinc-500"
                             )}>
                                 <Calendar className="w-3 h-3" />
                                 {new Date(task.due_date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}
                             </span>
                        )}
                    </div>

                    <h4 className="font-medium text-zinc-200 text-sm mb-4 leading-relaxed group-hover:text-indigo-300 transition-colors">
                        {task.title}
                    </h4>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-3 text-zinc-500">
                            {task.comments && task.comments.length > 0 && (
                                <div className="flex items-center gap-1.5 text-xs hover:text-indigo-400 transition-colors">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{task.comments.length}</span>
                                </div>
                            )}
                        </div>

                        {task.assignee ? (
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 border border-indigo-500/20" title={task.assignee.name}>
                                {task.assignee.name.charAt(0)}
                            </div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 hover:border-indigo-500/50 hover:text-indigo-400 transition-colors">
                                <UserIcon className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TaskModal
                task={task}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                members={members}
            />
        </>
    );
}
