import { useEffect, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword?: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="تسجيل الدخول" />

            {status && <div className="mb-4 font-medium text-sm text-emerald-400 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">{status}</div>}

            <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <LogIn className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">مرحباً بعودتك</h2>
                <p className="text-sm text-zinc-500 mt-2">أدخل بياناتك للدخول إلى مساحة العمل</p>
            </div>

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
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            dir="ltr"
                            placeholder="your@email.com"
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

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
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            dir="ltr"
                            placeholder="••••••••"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-zinc-400">تذكرني</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                        >
                            نسيت كلمة المرور؟
                        </Link>
                    )}
                </div>

                <div className="pt-1">
                    <Button className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20 transition-all gap-2" disabled={processing}>
                        <LogIn className="w-4 h-4" />
                        تسجيل الدخول
                    </Button>
                </div>

                <div className="text-center text-sm text-zinc-500">
                    ليس لديك حساب؟{' '}
                    <Link href={route('register')} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        أنشئ حساباً جديداً
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
