import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/Components/ui/button';
import { MailCheck, Send } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="تأكيد البريد الإلكتروني" />

            <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <MailCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-zinc-100">تأكيد بريدك الإلكتروني</h2>
                <p className="text-sm text-zinc-500 mt-2">
                    شكراً لتسجيلك! قبل البدء، يرجى تأكيد بريدك الإلكتروني بالضغط على الرابط المرسل إليك.
                </p>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-emerald-400 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20 flex items-center gap-2">
                    <MailCheck className="w-4 h-4 flex-shrink-0" />
                    تم إرسال رابط تأكيد جديد إلى بريدك الإلكتروني.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Button className="w-full h-11 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20 gap-2" disabled={processing}>
                    <Send className="w-4 h-4" />
                    إعادة إرسال رابط التأكيد
                </Button>

                <div className="text-center">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                        تسجيل الخروج
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
