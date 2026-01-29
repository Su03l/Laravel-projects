'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Users, Briefcase, DollarSign, FolderKanban, Clock, CheckCircle, TrendingUp, Bell } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface DashboardStats {
    employeesCount: number;
    activeProjects: number;
    netProfit: string;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            setStats({
                employeesCount: 12,
                activeProjects: 5,
                netProfit: '45,200 ريال',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAttendance = async (type: 'check-in' | 'check-out') => {
        const arabicType = type === 'check-in' ? 'تسجيل دخول' : 'تسجيل خروج';
        try {
            await api.post(`/attendance/${type}`);
            toast.success(`تم ${arabicType} بنجاح!`);
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `فشل في ${arabicType}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, colorClass, trend }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3.5 rounded-xl ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
                </div>
                {trend && (
                    <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">
                        <TrendingUp size={14} className="mr-1" />
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-slate-500 text-sm font-bold mb-1">{title}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl">
                        A
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">أهلاً بك، المدير العام 👋</h2>
                        <p className="text-slate-500 font-medium">إليك نظرة عامة على أداء الشركة اليوم.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => handleAttendance('check-in')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2 px-6 shadow-emerald-200"
                    >
                        <Clock size={20} /> تسجيل دخول
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => handleAttendance('check-out')}
                        className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 px-6"
                    >
                        <CheckCircle size={20} /> تسجيل خروج
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="إجمالي الموظفين"
                    value={stats?.employeesCount || 0}
                    icon={Users}
                    colorClass="bg-sky-500 text-sky-500"
                    trend="+2 هذا الشهر"
                />
                <StatCard
                    title="المشاريع النشطة"
                    value={stats?.activeProjects || 0}
                    icon={FolderKanban}
                    colorClass="bg-indigo-500 text-indigo-500"
                    trend="في الموعد"
                />
                <StatCard
                    title="صافي الأرباح"
                    value={stats?.netProfit || '0'}
                    icon={DollarSign}
                    colorClass="bg-emerald-500 text-emerald-500"
                    trend="+12%"
                />
            </div>

            {/* Recent Activity Placeholder with better design */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">آخر النشاطات</h3>
                        <button className="text-sky-500 text-sm font-bold hover:underline">عرض الكل</button>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="p-3 bg-sky-50 text-sky-500 rounded-full">
                                    <Bell size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 text-sm">تم تسجيل مشروع جديد</h4>
                                    <p className="text-xs text-slate-500 mt-1">قام أحمد بإضافة مشروع تطوير الموقع</p>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">منذ ساعتين</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 pattern-dots"></div>
                    <h3 className="text-lg font-bold mb-4 relative z-10">إجراءات سريعة</h3>
                    <div className="space-y-3 relative z-10">
                        <button className="w-full text-right p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-between">
                            <span>إضافة موظف جديد</span>
                            <Users size={16} />
                        </button>
                        <button className="w-full text-right p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium flex items-center justify-between">
                            <span>إنشاء فاتورة</span>
                            <DollarSign size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
