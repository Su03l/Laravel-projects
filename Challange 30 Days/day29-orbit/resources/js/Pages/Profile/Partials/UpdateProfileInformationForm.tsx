import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Check, User, Mail, Save, AlertCircle, SendHorizonal } from 'lucide-react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                    <InputLabel htmlFor="name" value="الاسم" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                            <User className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <TextInput
                            id="name"
                            className="block w-full pr-11 py-3 text-sm"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                            placeholder="أدخل اسمك الكامل"
                        />
                    </div>
                    <InputError className="mt-1" message={errors.name} />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <InputLabel htmlFor="email" value="البريد الإلكتروني" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                            <Mail className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            className="block w-full pr-11 py-3 text-sm"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                            placeholder="example@email.com"
                        />
                    </div>
                    <InputError className="mt-1" message={errors.email} />
                </div>

                {/* Email Verification Warning */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm text-amber-300 font-medium">بريدك الإلكتروني غير مؤكد</p>
                            <p className="text-xs text-zinc-500 mt-1">يرجى تأكيد بريدك الإلكتروني للوصول لجميع الميزات.</p>
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="inline-flex items-center gap-1.5 mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                            >
                                <SendHorizonal className="w-3 h-3" />
                                إعادة إرسال رابط التأكيد
                            </Link>

                            {status === 'verification-link-sent' && (
                                <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
                                    <Check className="w-3.5 h-3.5" />
                                    تم إرسال رابط تأكيد جديد
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.06]">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    >
                        <Save className="w-4 h-4" />
                        حفظ التغييرات
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-200"
                        leaveTo="opacity-0"
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400">
                            <Check className="w-4 h-4" />
                            تم الحفظ بنجاح
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
