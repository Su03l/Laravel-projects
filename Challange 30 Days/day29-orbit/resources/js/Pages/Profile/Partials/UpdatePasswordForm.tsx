import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';
import { Check, KeyRound, Lock, ShieldCheck, Save, Info } from 'lucide-react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            {/* Security Tip */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 mb-6">
                <Info className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-zinc-400 leading-relaxed">
                    استخدم كلمة مرور تتكون من 8 أحرف على الأقل، وتحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة.
                </p>
            </div>

            <form onSubmit={updatePassword} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                    <InputLabel htmlFor="current_password" value="كلمة المرور الحالية" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                            <KeyRound className="w-4 h-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                        </div>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="block w-full pr-11 py-3 text-sm"
                            autoComplete="current-password"
                            placeholder="أدخل كلمة المرور الحالية"
                        />
                    </div>
                    <InputError message={errors.current_password} className="mt-1" />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <InputLabel htmlFor="password" value="كلمة المرور الجديدة" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                            <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                        </div>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="block w-full pr-11 py-3 text-sm"
                            autoComplete="new-password"
                            placeholder="أدخل كلمة المرور الجديدة"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-1" />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <InputLabel htmlFor="password_confirmation" value="تأكيد كلمة المرور" />
                    <div className="relative group">
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                            <ShieldCheck className="w-4 h-4 text-zinc-500 group-focus-within:text-amber-400 transition-colors" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="block w-full pr-11 py-3 text-sm"
                            autoComplete="new-password"
                            placeholder="أعد كتابة كلمة المرور الجديدة"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1" />
                </div>

                {/* Submit */}
                <div className="flex items-center gap-4 pt-3 border-t border-white/[0.06]">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-medium rounded-xl hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                    >
                        <Save className="w-4 h-4" />
                        تحديث كلمة المرور
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
                            تم التحديث بنجاح
                        </span>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
