'use client';

import { useEffect } from 'react';
import ChatWindow from '@/components/Chat/ChatWindow';
import ContactInfo from '@/components/Chat/ContactInfo';
import { useStore } from '@/lib/store';
import { MessageSquarePlus, Sparkles, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { activeConversationId, conversations } = useStore();

    return (
        <div className="flex h-full w-full">
            <div className="flex-1 h-full min-w-0">
                {activeConversationId ? (
                    <ChatWindow />
                ) : (
                    /* Empty State - Premium Design */
                    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-white via-sky-50/30 to-white relative overflow-hidden">
                        {/* Background Decorations */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-20 right-20 w-72 h-72 bg-sky-100/50 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl"></div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative z-10 text-center max-w-md px-6"
                        >
                            {/* Animated Icon */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-24 h-24 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sky-500/30"
                            >
                                <MessageSquarePlus className="w-12 h-12 text-white" />
                            </motion.div>

                            <h2 className="text-3xl font-bold text-slate-900 mb-4">ابدأ دردشة جديدة</h2>
                            <p className="text-lg text-slate-500 leading-relaxed mb-8">
                                اختر محادثة من القائمة أو ابحث عن شخص جديد بالرقم وابدأ السوالف الحين!
                            </p>

                            {/* Feature Tags */}
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                                    <Zap className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-slate-700">رسائل فورية</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">قروبات</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-medium text-slate-700">مشاركة ملفات</span>
                                </div>
                            </div>

                            {/* Hint */}
                            <div className="text-sm text-slate-400">
                                👈 اضغط على "دردشة جديدة" في القائمة الجانبية
                            </div>
                        </motion.div>

                        {/* Decorative Floating Elements */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/4 left-1/4 w-4 h-4 bg-sky-300/50 rounded-full"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-300/50 rounded-full"
                        />
                    </div>
                )}
            </div>

            {/* Left Sidebar - Contact Info (Visually Left in RTL) */}
            {activeConversationId && (
                <div className="w-80 border-r border-slate-100 hidden xl:block">
                    <ContactInfo />
                </div>
            )}
        </div>
    );
}
