'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Users, Briefcase, DollarSign, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data.data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">جاري تحميل الإحصائيات...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">فشل تحميل البيانات</div>;

    // Prepare chart data
    const financialChartData = [
        { name: 'الإيرادات', amount: parseFloat(stats.financial_stats.revenue.replace(/,/g, '')) },
        { name: 'المصروفات', amount: parseFloat(stats.financial_stats.expenses.replace(/,/g, '')) },
        { name: 'الأرباح', amount: parseFloat(stats.financial_stats.net_profit.replace(/,/g, '')) },
    ];

    const projectChartData = [
        { name: 'نشط', value: stats.project_stats.active },
        { name: 'مكتمل', value: stats.project_stats.completed },
    ];

    const COLORS = ['#0ea5e9', '#10b981', '#f43f5e']; // Sky, Emerald, Rose

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم</h1>

            {/* Top Cards Stats */}
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
                        <div className="p-3 bg-sky-50 rounded-xl">
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
                        <div className="p-3 bg-indigo-50 rounded-xl">
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
                                {stats.financial_stats.net_profit} ر.س
                            </h3>
                            <p className="text-sm text-slate-400 mt-2 flex items-center gap-1">
                                {stats.financial_stats.profit_status === 'good' ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
                                {stats.financial_stats.profit_status === 'good' ? 'أداء مالي جيد' : 'خسارة'}
                            </p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl">
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
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
                                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
