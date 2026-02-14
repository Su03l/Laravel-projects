import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { FolderKanban } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#1a1a1a] relative overflow-hidden" dir="rtl">
            {/* Background Glow */}
            <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-indigo-600/[0.08] blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] bg-violet-600/[0.06] blur-[120px] rounded-full pointer-events-none" />

            {/* Logo */}
            <div className="mb-8 text-center relative z-10">
                <Link href="/" className="flex flex-col items-center gap-3 group">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/30 ring-1 ring-white/10 transform group-hover:scale-105 group-hover:rotate-[-3deg] transition-all duration-300">
                        <FolderKanban className="w-9 h-9" />
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">أوربت</span>
                </Link>
            </div>

            {/* Card */}
            <div className="w-full sm:max-w-md mt-2 px-7 py-8 bg-[#222222]/80 backdrop-blur-xl shadow-2xl shadow-black/30 overflow-hidden sm:rounded-2xl border border-white/[0.06] relative z-10">
                {children}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-zinc-600 relative z-10">
                &copy; {new Date().getFullYear()} أوربت لإدارة المشاريع. جميع الحقوق محفوظة.
            </div>
        </div>
    );
}
