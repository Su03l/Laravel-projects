import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Lock, ShieldCheck } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="تأكيد كلمة المرور" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">تأكيد كلمة المرور</h2>
                <p className="text-sm text-zinc-500 mt-2">
                    هذه منطقة محمية. يرجى تأكيد كلمة المرور قبل المتابعة.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="password" value="كلمة المرور" className="mb-1.5" />
                    <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pr-10"
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            dir="ltr"
                            placeholder="••••••••"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <Button className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20" disabled={processing}>
                    تأكيد
                </Button>
            </form>
        </GuestLayout>
    );
}
