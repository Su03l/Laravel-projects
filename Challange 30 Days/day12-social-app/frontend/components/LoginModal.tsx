'use client';

import Link from 'next/link';
import { useModal } from '@/contexts/ModalContext';
import { X, LogIn, UserPlus, ArrowRight } from 'lucide-react';

export default function LoginModal() {
    const { showLoginModal, closeLoginModal } = useModal();

    if (!showLoginModal) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90"
                onClick={closeLoginModal}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 border border-white/20 bg-black p-8">
                {/* Close Button */}
                <button
                    onClick={closeLoginModal}
                    className="absolute top-4 left-4 text-white/50 hover:text-white transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Content */}
                <div className="text-center">
                    <div className="mx-auto mb-6 h-16 w-16 bg-blue-500 flex items-center justify-center">
                        <LogIn className="h-8 w-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-black text-white mb-2">
                        تسجيل الدخول مطلوب
                    </h2>
                    <p className="text-white/50 mb-8">
                        يجب عليك تسجيل الدخول لعرض هذا المحتوى
                    </p>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/login"
                            onClick={closeLoginModal}
                            className="flex items-center justify-center gap-2 w-full bg-blue-500 py-3 font-bold text-white hover:bg-blue-600 transition-colors"
                        >
                            <LogIn className="h-5 w-5" />
                            تسجيل الدخول
                        </Link>

                        <Link
                            href="/register"
                            onClick={closeLoginModal}
                            className="flex items-center justify-center gap-2 w-full border border-white/30 py-3 font-bold text-white hover:bg-white/10 transition-colors"
                        >
                            <UserPlus className="h-5 w-5" />
                            إنشاء حساب جديد
                        </Link>

                        <button
                            onClick={closeLoginModal}
                            className="flex items-center justify-center gap-2 w-full py-3 text-white/50 hover:text-white transition-colors"
                        >
                            <ArrowRight className="h-4 w-4" />
                            متابعة التصفح
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
