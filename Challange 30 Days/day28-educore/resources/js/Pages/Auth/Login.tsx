import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { GraduationCap, Mail, Lock, ArrowLeft } from 'lucide-react';

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

            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-['Cairo']" dir="rtl">
                <div className="max-w-md w-full">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center bg-black p-3 rounded-2xl mb-6 shadow-[0_0_20px_rgba(0,209,255,0.3)]">
                            <GraduationCap className="w-8 h-8 text-[#00D1FF]" />
                        </div>
                        <h1 className="text-3xl font-black mb-2">مرحباً بعودتك</h1>
                        <p className="text-zinc-500 font-bold">أدخل بياناتك للوصول إلى لوحة التعلم الخاصة بك.</p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="text-right">
                            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-zinc-700">البريد الإلكتروني</label>
                            <div className="relative">
                                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:border-transparent outline-none transition-all text-right"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600 font-bold">{errors.email}</p>}
                        </div>

                        <div className="text-right">
                            <div className="flex justify-between mb-2 flex-row-reverse">
                                <label className="block text-sm font-bold uppercase tracking-wider text-zinc-700">كلمة المرور</label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-xs font-bold text-[#00D1FF] hover:underline">
                                        نسيت كلمة المرور؟
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:border-transparent outline-none transition-all text-right"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600 font-bold">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-start flex-row-reverse">
                            <label className="flex items-center cursor-pointer group flex-row-reverse">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-5 h-5 rounded border-zinc-300 text-black focus:ring-[#00D1FF]"
                                />
                                <span className="mr-3 text-sm font-bold text-zinc-600 group-hover:text-black transition-colors">تذكرني</span>
                            </label>
                        </div>

                        <button
                            disabled={processing}
                            className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all disabled:opacity-50 border border-transparent hover:border-[#00D1FF]"
                        >
                            {processing ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-zinc-500 text-sm font-bold">
                        ليس لديك حساب؟{' '}
                        <Link href="/register" className="font-black text-black hover:text-[#00D1FF] transition-colors">
                            إنشاء حساب جديد
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
