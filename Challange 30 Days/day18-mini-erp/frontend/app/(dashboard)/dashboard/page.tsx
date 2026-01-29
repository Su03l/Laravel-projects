'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Users, Briefcase, DollarSign, TrendingUp, TrendingDown,
    Clock, CheckCircle, Activity
} from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [statsRes, userRes] = await Promise.all([
                api.get('/dashboard'),
                api.get('/user')
            ]);
            setStats(statsRes.data.data);
            setUser(userRes.data);
        } catch (error) {
            console.error('Failed to fetch data', error);
            toast.error('فشل تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    const handleAttendance = async (type: 'check-in' | 'check-out') => {
        const arabicType = type === 'check-in' ? 'تسجيل دخول' : 'تسجيل خروج';
        try {
            await api.post(`/attendance/${type}`);
            toast.success(`تم ${arabicType} بنجاح!`);
            // fetchData(); // Refresh if needed
        } catch (error: any) {
            toast.error(error.response?.data?.message || `فشل في ${arabicType}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-slate-500 font-medium">جاري تحديث لوحة المعلومات...</div>
        </div>
    );

    if (!stats) return <div className="p-8 text-center text-red-500">فشل تحميل البيانات</div>;

    // Prepare chart data
    const financialChartData = [
        { name: 'الإيرادات', amount: parseFloat(stats.financial_stats.revenue.toString().replace(/,/g, '')) },
        { name: 'المصروفات', amount: parseFloat(stats.financial_stats.expenses.toString().replace(/,/g, '')) },
        { name: 'الأرباح', amount: parseFloat(stats.financial_stats.net_profit.toString().replace(/,/g, '')) },
    ];

    const projectChartData = [
        { name: 'نشط', value: stats.project_stats.active },
        { name: 'مكتمل', value: stats.project_stats.completed },
    ];

    const COLORS = ['#0ea5e9', '#10b981', '#f43f5e'];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl uppercase">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">أهلاً بك، {user?.name || 'المستخدم'}</h2>
                        <p className="text-slate-500 font-medium">
                            {user?.role === 'admin' ? 'مدير النظام' : user?.role === 'manager' ? 'مدير مشروع' : 'موظف'} - إليك نظرة عامة على أداء الشركة.
                        </p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Employees Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">الموظفين</p>
                            <h3 className="text-3xl font-bold text-slate-900">{stats.hr_stats.total_employees}</h3>
                            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1 font-medium">
                                <Activity size={16} />
                                {stats.hr_stats.pending_leave_requests} طلب إجازة معلق
                            </p>
                        </div>
                        <div className="p-3 bg-sky-50 rounded-xl group-hover:bg-sky-100 transition-colors">
                            <Users className="text-sky-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Projects Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">المشاريع</p>
                            <h3 className="text-3xl font-bold text-slate-900">{stats.project_stats.total}</h3>
                            <div className="flex gap-3 mt-2 text-sm">
                                <span className="text-emerald-600 font-medium">{stats.project_stats.completed} مكتمل</span>
                                <span className="text-sky-600 font-medium">{stats.project_stats.active} نشط</span>
                            </div>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                            <Briefcase className="text-indigo-500" size={24} />
                        </div>
                    </div>
                </div>

                {/* Financial Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start z-10 relative">
                        <div>
                            <p className="text-slate-500 font-medium mb-1">صافي الأرباح</p>
                            <h3 className={`text-3xl font-bold ${stats.financial_stats.profit_status === 'good' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stats.financial_stats.net_profit}
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 flex items-center gap-1">
                                {stats.financial_stats.profit_status === 'good' ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
                                {stats.financial_stats.profit_status === 'good' ? 'أداء مالي جيد' : 'خسارة'}
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <DollarSign className="text-emerald-500" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Financial Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">الأداء المالي</h3>
                    <div className="h-80 w-full" style={{ direction: 'ltr' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financialChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', direction: 'rtl' }}
                                />
                                <Bar dataKey="amount" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Status Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">حالة المشاريع</h3>
                    <div className="h-80 w-full flex justify-center items-center" style={{ direction: 'ltr' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', direction: 'rtl' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
