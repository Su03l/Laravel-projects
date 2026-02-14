import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Mail, KeyRound } from 'lucide-react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="نسيت كلمة المرور" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">نسيت كلمة المرور؟</h2>
                <p className="text-sm text-zinc-500 mt-2">
                    لا مشكلة! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="البريد الإلكتروني" className="mb-1.5" />
                    <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full pr-10"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            dir="ltr"
                            placeholder="your@email.com"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <Button className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20" disabled={processing}>
                    إرسال رابط إعادة التعيين
                </Button>
            </form>
        </GuestLayout>
    );
}
