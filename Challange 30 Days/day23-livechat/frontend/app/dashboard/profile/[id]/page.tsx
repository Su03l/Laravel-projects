'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { motion } from 'framer-motion';

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axios.get(`/users/${params.id}`);
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
                // router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchUser();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p>المستخدم غير موجود</p>
                <Link href="/dashboard" className="mt-4 text-sky-500 hover:underline">العودة للرئيسية</Link>
            </div>
        );
    }

    const displayAvatar = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL}/storage/${user.avatar}`) : null;

    return (
        <div className="h-full relative overflow-hidden bg-slate-50">
            {/* Background Gradients & Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="h-full overflow-y-auto relative z-10 p-6 flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">الملف الشخصي</h1>
                        </div>
                        <Link href="/dashboard" className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all group">
                            <ArrowLeft className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[32px] border border-white/50 shadow-xl shadow-slate-200/50 p-8 relative overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center text-center"
                        >
                            {/* Professional Card Header */}
                            <div className="w-full h-32 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-2xl mb-[-64px] relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                                        {displayAvatar ? (
                                            <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold text-4xl">
                                                {user?.name?.[0] || 'م'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {user?.is_online && (
                                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" title="متصل الآن"></div>
                                )}
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{user?.name}</h2>
                            <p className="text-slate-500 max-w-md mx-auto mb-8 px-4 leading-relaxed">
                                {user?.about || 'لا توجد نبذة شخصية'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <span className="text-sm text-slate-500 mb-1">تاريخ الانضمام</span>
                                    <span className="font-bold text-slate-700 dir-ltr">{new Date(user?.created_at || Date.now()).toLocaleDateString('en-US')}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center">
                                    <span className="text-sm text-slate-500 mb-1">رقم الجوال</span>
                                    <span className="font-bold text-slate-700 dir-ltr">{user?.phone}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
