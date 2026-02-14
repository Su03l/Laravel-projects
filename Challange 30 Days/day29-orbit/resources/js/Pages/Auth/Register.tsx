import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="إنشاء حساب جديد" />

            <div className="text-center mb-8">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">انضم إلى أوربت</h2>
                <p className="text-sm text-zinc-500 mt-2">ابدأ إدارة مشاريعك باحترافية اليوم</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="الاسم الكامل" className="mb-1.5" />
                    <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full pr-10"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="الاسم الكامل"
                        />
                    </div>
                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                            required
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            dir="ltr"
                            placeholder="••••••••"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور" className="mb-1.5" />
                    <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full pr-10"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            dir="ltr"
                            placeholder="••••••••"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <Link
                        href={route('login')}
                        className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
                    >
                        لديك حساب بالفعل؟
                    </Link>
                </div>

                <div>
                    <Button className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20 transition-all gap-2" disabled={processing}>
                        <UserPlus className="w-4 h-4" />
                        إنشاء الحساب
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
