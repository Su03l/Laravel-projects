import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskColumn, Task, User } from '@/types/models';
import { MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import TaskCard from './TaskCard';
import CreateTaskDialog from './CreateTaskDialog';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface BoardColumnProps {
    column: TaskColumn;
    tasks: Task[];
    members: User[];
}

export default function BoardColumn({ column, tasks, members }: BoardColumnProps) {
    const tasksIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
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
                className="bg-zinc-900/30 border border-dashed border-indigo-500/50 w-[320px] h-[calc(100vh-180px)] rounded-2xl flex-shrink-0"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="w-[320px] h-full flex flex-col flex-shrink-0 group"
        >
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                className="flex items-center justify-between mb-3 px-1 cursor-grab active:cursor-grabbing"
            >
                <div className="flex gap-2 items-center">
                    <h3 className="font-bold text-zinc-300 text-sm tracking-wide">{column.name}</h3>
                    <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/5">
                        {tasks.length}
                    </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-200 hover:bg-white/5">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Tasks Container */}
            <div className={cn(
                "flex-1 flex flex-col gap-3 overflow-y-auto overflow-x-hidden px-1 pb-4 scrollbar-hide",
                "rounded-2xl transition-colors"
            )}>
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} members={members} />
                    ))}
                </SortableContext>

                <CreateTaskDialog columnId={column.id} projectId={column.project_id} />
            </div>
        </div>
    );
}
