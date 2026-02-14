import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useState } from 'react';
import { User, Shield, Trash2, Mail, Calendar, ChevronLeft, Sparkles } from 'lucide-react';

type Tab = 'profile' | 'security' | 'danger';

export default function Edit({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage().props.auth.user;
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const tabs = [
        { id: 'profile' as Tab, label: 'معلومات الحساب', icon: User, color: 'indigo' },
        { id: 'security' as Tab, label: 'الأمان وكلمة المرور', icon: Shield, color: 'amber' },
        { id: 'danger' as Tab, label: 'منطقة الخطر', icon: Trash2, color: 'rose' },
    ];

    const colorMap: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
        indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', activeBg: 'bg-indigo-500/10' },
        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', activeBg: 'bg-amber-500/10' },
        rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', activeBg: 'bg-rose-500/10' },
    };

    return (
        <AppLayout>
            <Head title="الملف الشخصي" />

            <div className="p-6 md:p-8 space-y-6">
                {/* Hero Profile Header */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/30 via-[#1e1e1e] to-violet-600/20 border border-white/[0.08]">
                    {/* Background Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[80px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/5 blur-[60px]" />
                    </div>

                    <div className="relative z-10 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-500/30 border-2 border-white/20 ring-4 ring-white/5">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-[#1a1a1a]">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="text-center md:text-right flex-1">
                                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                                    {user.name}
                                </h1>
                                <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 mt-3">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-zinc-400 text-sm">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span dir="ltr">{user.email}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                                        <Calendar className="w-3.5 h-3.5" />
                                        حساب نشط
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs + Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Tabs Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="bg-[#1e1e1e]/80 backdrop-blur-sm rounded-2xl border border-white/[0.06] p-2 lg:sticky lg:top-8 space-y-1">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                const colors = colorMap[tab.color];
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${isActive
                                                ? `${colors.activeBg} border ${colors.border} ${colors.text}`
                                                : 'border border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className={`absolute inset-0 bg-gradient-to-l from-transparent ${colors.bg} opacity-50 pointer-events-none`} />
                                        )}
                                        <tab.icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? colors.text : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                                        <span className="relative z-10 flex-1 text-right">{tab.label}</span>
                                        {isActive && <ChevronLeft className={`w-4 h-4 relative z-10 ${colors.text} opacity-50`} />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="bg-[#1e1e1e]/80 backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden animate-in fade-in duration-300">
                                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                                        <User className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-zinc-100 text-lg">معلومات الحساب</h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">تعديل بيانات حسابك الأساسية</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-[#1e1e1e]/80 backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden animate-in fade-in duration-300">
                                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-zinc-100 text-lg">الأمان وكلمة المرور</h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">حماية حسابك بكلمة مرور قوية</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'danger' && (
                            <div className="bg-[#1e1e1e]/80 backdrop-blur-sm rounded-2xl border border-rose-500/10 overflow-hidden animate-in fade-in duration-300">
                                <div className="px-6 py-5 border-b border-rose-500/10 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/20 flex items-center justify-center">
                                        <Trash2 className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-rose-400 text-lg">منطقة الخطر</h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">إجراءات لا يمكن التراجع عنها</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <DeleteUserForm className="max-w-xl" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
