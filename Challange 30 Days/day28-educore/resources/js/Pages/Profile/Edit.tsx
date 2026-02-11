import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { User, Lock, CheckCircle2 } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Edit() {
    const user = usePage().props.auth.user;

    // Form for Profile Info
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    // Form for Password
    const {
        data: passwordData,
        setData: setPasswordData,
        put: putPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        recentlySuccessful: passwordRecentlySuccessful,
        reset: resetPassword
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const submitPassword: FormEventHandler = (e) => {
        e.preventDefault();
        putPassword(route('password.update'), {
            onSuccess: () => resetPassword(),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="الملف الشخصي" />

            <div className="max-w-4xl mx-auto font-['Cairo']" dir="rtl">
                <div className="mb-10 text-right">
                    <h1 className="text-3xl font-black mb-2">إعدادات الحساب</h1>
                    <p className="text-zinc-500 font-bold">إدارة معلوماتك الشخصية وإعدادات الأمان.</p>
                </div>

                <div className="grid gap-8">
                    {/* Profile Information */}
                    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8 flex-row-reverse">
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="bg-black p-2 rounded-xl">
                                    <User className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="text-xl font-black">المعلومات الشخصية</h2>
                            </div>
                            {recentlySuccessful && (
                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                                    <CheckCircle2 className="w-4 h-4" />
                                    تم الحفظ بنجاح
                                </div>
                            )}
                        </div>

                        <form onSubmit={submitProfile} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="text-right">
                                    <label className="block text-sm font-bold mb-2 text-zinc-700">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right font-bold"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name}</p>}
                                </div>
                                <div className="text-right">
                                    <label className="block text-sm font-bold mb-2 text-zinc-700">البريد الإلكتروني</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right font-bold"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500 font-bold">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    disabled={processing}
                                    className="bg-black text-white px-8 py-3 rounded-2xl font-black hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF] disabled:opacity-50"
                                >
                                    {processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Password Update */}
                    <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8 flex-row-reverse">
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="bg-black p-2 rounded-xl">
                                    <Lock className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="text-xl font-black">تغيير كلمة المرور</h2>
                            </div>
                            {passwordRecentlySuccessful && (
                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                                    <CheckCircle2 className="w-4 h-4" />
                                    تم تحديث كلمة المرور
                                </div>
                            )}
                        </div>

                        <form onSubmit={submitPassword} className="space-y-6">
                            <div className="space-y-4">
                                <div className="text-right">
                                    <label className="block text-sm font-bold mb-2 text-zinc-700">كلمة المرور الحالية</label>
                                    <input
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right"
                                    />
                                    {passwordErrors.current_password && <p className="mt-1 text-xs text-red-500 font-bold">{passwordErrors.current_password}</p>}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="text-right">
                                        <label className="block text-sm font-bold mb-2 text-zinc-700">كلمة المرور الجديدة</label>
                                        <input
                                            type="password"
                                            value={passwordData.password}
                                            onChange={(e) => setPasswordData('password', e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right"
                                        />
                                        {passwordErrors.password && <p className="mt-1 text-xs text-red-500 font-bold">{passwordErrors.password}</p>}
                                    </div>
                                    <div className="text-right">
                                        <label className="block text-sm font-bold mb-2 text-zinc-700">تأكيد كلمة المرور</label>
                                        <input
                                            type="password"
                                            value={passwordData.password_confirmation}
                                            onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    disabled={passwordProcessing}
                                    className="bg-black text-white px-8 py-3 rounded-2xl font-black hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF] disabled:opacity-50"
                                >
                                    {passwordProcessing ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
