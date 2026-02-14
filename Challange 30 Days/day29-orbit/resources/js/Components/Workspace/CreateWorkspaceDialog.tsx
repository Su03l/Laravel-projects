import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Plus } from 'lucide-react';

export default function CreateWorkspaceDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('workspaces.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" />
                    مساحة عمل جديدة
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#222222] border-white/[0.06] text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-zinc-100">إنشاء مساحة عمل جديدة</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="اسم الشركة أو الفريق..."
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            autoFocus
                            className="bg-white/[0.04] border-white/[0.08] text-zinc-100 placeholder:text-zinc-600"
                        />
                        {errors.name && <p className="text-rose-500 text-sm">{errors.name}</p>}
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
