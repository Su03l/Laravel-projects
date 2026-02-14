import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus } from 'lucide-react';

interface CreateTaskDialogProps {
    columnId: number;
    projectId: number;
}

export default function CreateTaskDialog({ columnId, projectId }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        project_id: projectId,
        task_column_id: columnId,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tasks.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="w-full py-2.5 flex items-center justify-center gap-2 text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all text-sm font-medium mt-2 border border-transparent hover:border-indigo-500/20 group">
                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    إضافة مهمة
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0c0c0e] border-white/10 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">إضافة مهمة جديدة</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="ما الذي يجب إنجازه؟"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            autoFocus
                            className="text-lg py-6 bg-zinc-900/50 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus:ring-indigo-500/50"
                        />
                        {errors.title && <p className="text-rose-500 text-sm">{errors.title}</p>}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                            {processing ? 'جاري الإضافة...' : 'إضافة المهمة'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
