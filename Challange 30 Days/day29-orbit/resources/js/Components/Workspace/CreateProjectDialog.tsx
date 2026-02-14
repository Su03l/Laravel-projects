import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Plus } from 'lucide-react';

interface CreateProjectDialogProps {
    workspaceId: number;
}

export default function CreateProjectDialog({ workspaceId }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        description: '',
        workspace_id: workspaceId,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full mt-2 text-xs border-dashed border border-white/[0.06] text-zinc-500 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20">
                    <Plus className="w-3 h-3 ml-1" />
                    مشروع جديد
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#222222] border-white/[0.06] text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">إنشاء مشروع جديد</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="اسم المشروع..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                            className="bg-white/[0.04] border-white/[0.08] text-zinc-100 placeholder:text-zinc-600"
                        />
                        {errors.name && <p className="text-rose-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder="وصف المشروع (اختياري)..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="bg-white/[0.04] border-white/[0.08] text-zinc-100 placeholder:text-zinc-600"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05]">
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0">
                            {processing ? 'جاري الإنشاء...' : 'إنشاء'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
