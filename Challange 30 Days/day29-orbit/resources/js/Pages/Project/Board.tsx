import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Project, TaskColumn, Task, User } from '@/types/models';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, DragOverEvent, useSensor, useSensors, PointerSensor, TouchSensor, closestCorners, defaultDropAnimationSideEffects, DropAnimation } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import BoardColumn from '@/Components/Board/BoardColumn';
import TaskCard from '@/Components/Board/TaskCard';
import { Users, Settings, Filter, Search, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';

interface ProjectBoardProps {
    project: Project;
    columns: TaskColumn[];
    members: User[];
}

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export default function Board({ project, columns, members }: ProjectBoardProps) {
    const [columnsState, setColumnsState] = useState<TaskColumn[]>(columns);
    const columnsIds = useMemo(() => columnsState.map((col) => col.id), [columnsState]);
    const [activeColumn, setActiveColumn] = useState<TaskColumn | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor)
    );

    // ... (نفس منطق السحب والإفلات - لم يتغير)
    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            setActiveColumn(event.active.data.current.column);
            return;
        }
        if (event.active.data.current?.type === 'Task') {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;
        const isActiveAColumn = active.data.current?.type === 'Column';
        if (!isActiveAColumn) return;
        setColumnsState((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
            const overColumnIndex = columns.findIndex((col) => col.id === overId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;
        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';
        if (!isActiveATask) return;
        if (isActiveATask && isOverATask) {
            setColumnsState((columns) => {
                const activeIndex = columns.findIndex((col) => col.tasks.some((task) => task.id === activeId));
                const overIndex = columns.findIndex((col) => col.tasks.some((task) => task.id === overId));
                if (columns[activeIndex].id !== columns[overIndex].id) {
                    const activeTask = columns[activeIndex].tasks.find((task) => task.id === activeId);
                    const overTask = columns[overIndex].tasks.find((task) => task.id === overId);
                    if (activeTask && overTask) {
                        columns[activeIndex].tasks = columns[activeIndex].tasks.filter((task) => task.id !== activeId);
                        columns[overIndex].tasks.splice(columns[overIndex].tasks.indexOf(overTask), 0, activeTask);
                        router.put(route('tasks.move', activeId), {
                            column_id: columns[overIndex].id,
                            position: columns[overIndex].tasks.indexOf(activeTask)
                        }, { preserveScroll: true });
                    }
                } else {
                    const activeTaskIndex = columns[activeIndex].tasks.findIndex((task) => task.id === activeId);
                    const overTaskIndex = columns[overIndex].tasks.findIndex((task) => task.id === overId);
                    columns[activeIndex].tasks = arrayMove(columns[activeIndex].tasks, activeTaskIndex, overTaskIndex);
                    router.put(route('tasks.move', activeId), {
                        column_id: columns[activeIndex].id,
                        position: overTaskIndex
                    }, { preserveScroll: true });
                }
                return [...columns];
            });
        }
        const isOverAColumn = over.data.current?.type === 'Column';
        if (isActiveATask && isOverAColumn) {
            setColumnsState((columns) => {
                const activeIndex = columns.findIndex((col) => col.tasks.some((task) => task.id === activeId));
                const overIndex = columns.findIndex((col) => col.id === overId);
                if (columns[activeIndex].id !== columns[overIndex].id) {
                    const activeTask = columns[activeIndex].tasks.find((task) => task.id === activeId);
                    if (activeTask) {
                        columns[activeIndex].tasks = columns[activeIndex].tasks.filter((task) => task.id !== activeId);
                        columns[overIndex].tasks.push(activeTask);
                        router.put(route('tasks.move', activeId), {
                            column_id: columns[overIndex].id,
                            position: columns[overIndex].tasks.length - 1
                        }, { preserveScroll: true });
                    }
                }
                return [...columns];
            });
        }
    }

    return (
        <AppLayout>
            <Head title={project.name} />

            <div className="flex flex-col h-screen">
                {/* Dark Header */}
                <div className="bg-[#09090b]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 ring-1 ring-white/10">
                            <span className="font-bold text-lg">{project.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-zinc-100">{project.name}</h1>
                            <p className="text-xs text-zinc-500 font-medium">آخر تحديث {project.updated_at}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative hidden md:block group">
                            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <input
                                className="w-64 pl-4 pr-9 bg-zinc-900/50 border border-white/5 rounded-lg text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all h-9"
                                placeholder="بحث في المهام..."
                            />
                        </div>

                        {/* Members Stack */}
                        <div className="flex -space-x-2 rtl:space-x-reverse px-2">
                            {members.slice(0, 4).map((member) => (
                                <div key={member.id} className="relative group cursor-pointer">
                                    <img
                                        className="w-8 h-8 rounded-full border-2 border-[#09090b] ring-1 ring-white/10 object-cover"
                                        src={`https://ui-avatars.com/api/?name=${member.name}&background=random&color=fff`}
                                        alt={member.name}
                                    />
                                </div>
                            ))}
                            <button className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#09090b] flex items-center justify-center text-zinc-400 text-xs font-medium hover:bg-zinc-700 transition-colors ring-1 ring-white/10">
                                <Users className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-1"></div>

                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Board Canvas */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                    >
                        <div className="flex gap-6 h-full min-w-max pb-4">
                            <SortableContext items={columnsIds}>
                                {columnsState.map((col) => (
                                    <BoardColumn
                                        key={col.id}
                                        column={col}
                                        tasks={col.tasks}
                                        members={members}
                                    />
                                ))}
                            </SortableContext>

                            {/* Add Column Button */}
                            <div className="w-[320px] flex-shrink-0">
                                <button className="w-full h-12 rounded-xl border border-dashed border-zinc-800 text-zinc-500 font-medium hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 group">
                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span>إضافة قائمة جديدة</span>
                                </button>
                            </div>
                        </div>

                        {createPortal(
                            <DragOverlay dropAnimation={dropAnimation}>
                                {activeColumn && (
                                    <BoardColumn
                                        column={activeColumn}
                                        tasks={activeColumn.tasks}
                                        members={members}
                                    />
                                )}
                                {activeTask && (
                                    <TaskCard task={activeTask} members={members} />
                                )}
                            </DragOverlay>,
                            document.body
                        )}
                    </DndContext>
                </div>
            </div>
        </AppLayout>
    );
}
