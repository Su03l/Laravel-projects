import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Task, User } from '@/types/models';
import { Calendar, User as UserIcon, MessageSquare, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    members: User[];
}

export default function TaskModal({ task, isOpen, onClose, members }: TaskModalProps) {
    const { data, setData, put, processing } = useForm({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        assigned_to: task.assigned_to || '',
        due_date: task.due_date || '',
    });

    const [comment, setComment] = useState('');
    const commentForm = useForm({
        content: '',
    });

    const handleUpdate = () => {
        put(route('tasks.update', task.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: Show toast
            }
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.setData('content', comment);
        commentForm.post(route('comments.store', task.id), {
            preserveScroll: true,
            onSuccess: () => setComment(''),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#0c0c0e] border-white/10 text-zinc-100 shadow-2xl shadow-black/50">
                <div className="flex h-full">
                    {/* Main Content (Right) */}
                    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                        <DialogHeader className="mb-8 text-right">
                            <Input
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                onBlur={handleUpdate}
                                className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent text-zinc-100 placeholder:text-zinc-600"
                            />
                        </DialogHeader>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    الوصف
                                </h3>
                                <Textarea
                                    placeholder="أضف وصفاً للمهمة..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    onBlur={handleUpdate}
                                    className="min-h-[120px] resize-none bg-zinc-900/50 border-white/5 text-zinc-300 focus:ring-indigo-500/20 focus:border-indigo-500/20"
                                />
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    النشاطات والتعليقات
                                </h3>

                                <div className="space-y-4 mb-6">
                                    {task.comments?.map((comment) => (
                                        <div key={comment.id} className="flex gap-4 group">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0 border border-indigo-500/10">
                                                {comment.user?.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-sm text-zinc-300">{comment.user?.name}</span>
                                                    <span className="text-[10px] text-zinc-600">{comment.created_at}</span>
                                                </div>
                                                <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/30 p-3 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                                                    {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0" />
                                    <div className="flex-1 gap-2 flex flex-col">
                                        <Textarea
                                            placeholder="اكتب تعليقاً..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="min-h-[80px] bg-zinc-900/50 border-white/5 text-zinc-300 focus:ring-indigo-500/20"
                                        />
                                        <div className="flex justify-end">
                                            <Button type="submit" disabled={commentForm.processing} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                                                إرسال التعليق
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Left) */}
                    <div className="w-[300px] bg-[#09090b] p-6 space-y-8 border-r border-white/5">
                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">المسؤول</label>
                            <select
                                className="w-full rounded-lg bg-zinc-900 border-white/10 text-zinc-300 text-sm focus:border-indigo-500/50 focus:ring-indigo-500/50 py-2.5"
                                value={data.assigned_to}
                                onChange={(e) => {
                                    setData('assigned_to', e.target.value);
                                    // Trigger update immediately
                                }}
                            >
                                <option value="">غير معين</option>
                                {members.map((member) => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">الأولوية</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['low', 'medium', 'high'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setData('priority', p as 'low' | 'medium' | 'high')}
                                        className={cn(
                                            "px-2 py-2 rounded-lg text-xs font-medium border transition-all",
                                            data.priority === p
                                                ? p === 'high' ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                                                    : p === 'medium' ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                                        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                                                : "bg-zinc-900 border-white/5 text-zinc-500 hover:bg-zinc-800"
                                        )}
                                    >
                                        {p === 'high' ? 'عاجل' : p === 'medium' ? 'متوسط' : 'عادي'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">تاريخ التسليم</label>
                            <Input
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="bg-zinc-900 border-white/10 text-zinc-300 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white" onClick={handleUpdate} disabled={processing}>
                                حفظ التغييرات
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
