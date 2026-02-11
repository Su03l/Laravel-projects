import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { GraduationCap, Mail, Lock, User, ArrowLeft } from 'lucide-react';

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
            <Head title="إنشاء حساب" />

            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-['Cairo']" dir="rtl">
                <div className="max-w-md w-full">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center bg-black p-3 rounded-2xl mb-6 shadow-[0_0_20px_rgba(0,209,255,0.3)]">
                            <GraduationCap className="w-8 h-8 text-[#00D1FF]" />
                        </div>
                        <h1 className="text-3xl font-black mb-2">إنشاء حساب جديد</h1>
                        <p className="text-zinc-500 font-bold">انضم إلى إديوكور وابدأ رحلتك التعليمية اليوم.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div className="text-right">
                            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-zinc-700">الاسم الكامل</label>
                            <div className="relative">
                                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:border-transparent outline-none transition-all text-right"
                                    placeholder="الاسم الكامل"
                                    required
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-600 font-bold">{errors.name}</p>}
                        </div>

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
                            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-zinc-700">كلمة المرور</label>
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

                        <div className="text-right">
                            <label className="block text-sm font-bold mb-2 uppercase tracking-wider text-zinc-700">تأكيد كلمة المرور</label>
                            <div className="relative">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="w-full pr-12 pl-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] focus:border-transparent outline-none transition-all text-right"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={processing}
                            className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all disabled:opacity-50 border border-transparent hover:border-[#00D1FF] mt-4"
                        >
                            {processing ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-zinc-500 text-sm font-bold">
                        لديك حساب بالفعل؟{' '}
                        <Link href="/login" className="font-black text-black hover:text-[#00D1FF] transition-colors">
                            تسجيل الدخول بدلاً من ذلك
                        </Link>
                    </p>
                </div>
            </div>
        </GuestLayout>
    );
}
