import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Form Side (Right in RTL) */}
            <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <Link href="/" className="flex items-center gap-2 mb-8 flex-row-reverse justify-end">
                        <span className="font-display text-2xl font-bold">
                            Stay<span className="text-primary">Ease</span>
                        </span>
                        <Building2 className="h-8 w-8 text-primary" />
                    </Link>
                    {children}
                </div>
            </div>

            {/* Image Side (Left in RTL) */}
            <div className="hidden lg:block relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070)',
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 to-stone-950/40" />
                </div>
                <div className="relative z-10 flex flex-col justify-end h-full p-12 text-right">
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-display text-white leading-relaxed text-right">
                            &ldquo;أروع تجربة فندقية حظيت بها على الإطلاق. كل تفصيل تم صياغته بدقة
                            لتوفير أقصى درجات الراحة والفخامة.&rdquo;
                        </p>
                        <footer className="text-stone-300 text-right">
                            <p className="font-medium text-white">سارة الأحمد</p>
                            <p className="text-sm">خبيرة سفر</p>
                        </footer>
                    </blockquote>
                </div>
            </div>
        </div>
    );
}
