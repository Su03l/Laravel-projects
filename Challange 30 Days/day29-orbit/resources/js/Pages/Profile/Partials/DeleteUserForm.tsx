import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { AlertTriangle, Lock, Trash2, X, ShieldAlert } from 'lucide-react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            {/* Warning Card */}
            <div className="rounded-xl bg-gradient-to-br from-rose-500/5 to-rose-600/5 border border-rose-500/15 overflow-hidden">
                <div className="flex items-start gap-3.5 p-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
                        <ShieldAlert className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-rose-300">تحذير — هذا الإجراء لا يمكن التراجع عنه</h3>
                        <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                            عند حذف حسابك، سيتم حذف جميع بياناتك ومشاريعك ومساحات عملك بشكل دائم ونهائي. يرجى التأكد من تنزيل أي بيانات مهمة قبل المتابعة.
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Button */}
            <button
                onClick={confirmUserDeletion}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-rose-600 to-red-700 text-white text-sm font-medium rounded-xl hover:from-rose-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all shadow-lg shadow-rose-500/20 hover:shadow-rose-600/30"
            >
                <Trash2 className="w-4 h-4" />
                حذف الحساب نهائياً
            </button>

            {/* Confirmation Modal */}
            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    {/* Modal Header */}
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-600/20 border border-rose-500/30 flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-rose-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-zinc-100">تأكيد حذف الحساب</h2>
                            <p className="text-xs text-zinc-500 mt-0.5">هذا الإجراء نهائي ولا يمكن التراجع عنه</p>
                        </div>
                        <button type="button" onClick={closeModal} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Warning */}
                    <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 mb-5">
                        <p className="text-sm text-zinc-400 leading-relaxed">
                            سيتم حذف جميع بياناتك ومشاريعك بشكل نهائي. أدخل كلمة المرور لتأكيد الحذف.
                        </p>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <InputLabel htmlFor="password" value="كلمة المرور" />
                        <div className="relative group">
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none z-10">
                                <Lock className="w-4 h-4 text-zinc-500 group-focus-within:text-rose-400 transition-colors" />
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="block w-full pr-11 py-3 text-sm"
                                isFocused
                                placeholder="أدخل كلمة المرور للتأكيد"
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 text-sm font-medium text-zinc-300 bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.1] transition-all"
                        >
                            إلغاء
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-red-700 text-white text-sm font-medium rounded-xl hover:from-rose-700 hover:to-red-800 disabled:opacity-50 transition-all shadow-lg shadow-rose-500/20"
                        >
                            <Trash2 className="w-4 h-4" />
                            حذف نهائياً
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
