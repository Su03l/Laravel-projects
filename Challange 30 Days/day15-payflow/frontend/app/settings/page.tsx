'use client';

import React from 'react';
import {
    ChevronRight,
    Bell,
    Shield,
    Globe,
    Moon,
    Smartphone,
    Info,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-brand-dark pb-20 p-6 flex flex-col items-center">
            <div className="w-full max-w-md flex flex-col">
                <header className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">الإعدادات</h1>
                </header>

                <main className="space-y-8">
                    {/* General Settings */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">الإعدادات العامة</h3>
                        <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
                            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">التنبيهات</span>
                                </div>
                                <div className="w-12 h-6 bg-brand-blue/20 rounded-full relative flex items-center px-1">
                                    <div className="w-4 h-4 bg-brand-blue rounded-full shadow-lg translate-x-6" />
                                </div>
                            </div>
                            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">خصوصية الحساب</span>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-slate-600" />
                            </div>
                            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">لغة التطبيق</span>
                                </div>
                                <span className="text-xs text-slate-500 font-bold">العربية (SA)</span>
                            </div>
                        </div>
                    </div>

                    {/* Theme & Display */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">المظهر والعرض</h3>
                        <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
                            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                        <Moon className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">الوضع الليلي</span>
                                </div>
                                <span className="text-xs text-brand-blue font-bold">مفعل دائماً</span>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">عن PayFlow</h3>
                        <div className="glass rounded-3xl overflow-hidden divide-y divide-white/5">
                            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                        <Smartphone className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">إصدار التطبيق</span>
                                </div>
                                <span className="text-xs text-slate-500 font-bold font-mono">v1.2.4-build.102</span>
                            </div>
                            <div className="p-5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                        <Info className="w-5 h-5" />
                                    </div>
                                    <span className="text-white font-medium">مركز المساعدة</span>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
