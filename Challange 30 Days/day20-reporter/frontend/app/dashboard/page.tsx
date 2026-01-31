'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import StatsCard from '@/components/StatsCard';
import TransactionsTable from '@/components/TransactionsTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddEmployeeModal from '@/components/AddEmployeeModal';
import FinancialChart from '@/components/FinancialChart';
import { Wallet, TrendingUp, TrendingDown, Plus, FileSpreadsheet, UserPlus, LogOut, Menu, Crown, User, Hand, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ total_income: 0, total_expense: 0, net_profit: 0 });
    const [transactions, setTransactions] = useState([]);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    const fetchData = useCallback(async () => {
        try {
            setLoadingData(true);
            const [statsRes, transactionsRes] = await Promise.all([
                axios.get('/stats'),
                axios.get('/transactions')
            ]);
            setStats(statsRes.data);
            setTransactions(transactionsRes.data.data || transactionsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingData(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user, fetchData]);

    const handleExportExcel = async () => {
        try {
            const response = await axios.get('/report/excel', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transactions_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('تم تحميل ملف الإكسل بنجاح', { icon: '📊' }); // Hot toast default or icon
        } catch (error) {
            console.error(error);
            toast.error('صار خطأ في التحميل، حاول مرة ثانية');
        }
    };

    if (isLoading || !user) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-10 w-10 border-4 border-sky-600 border-t-transparent"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans" dir="rtl">
            {/* Header / Navbar */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/20">
                            <Wallet className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">الداشبورد المالي</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs text-gray-500">داخل بحساب</span>
                            <div className="flex items-center gap-1">
                                {user.role === 'admin' ? <Crown className="h-3 w-3 text-yellow-500" /> : <User className="h-3 w-3 text-gray-500" />}
                                <span className="text-sm font-bold text-gray-900">{user.role === 'admin' ? 'مدير النظام' : 'موظف'}</span>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-red-600 transition-all duration-200"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">تسجيل خروج</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Message */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        حياك الله، كيف الأمور اليوم؟ <Hand className="h-6 w-6 text-yellow-500 animate-pulse" />
                    </h2>
                    <p className="text-gray-500 mt-1">هذي نظرة سريعة على الوضع المالي</p>
                </div>

                {/* Metrics & Chart Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatsCard
                                title="مجموع الدخل"
                                value={`$${Number(stats.total_income).toFixed(2)}`}
                                icon={TrendingUp}
                                color="green"
                            />
                            <StatsCard
                                title="المصاريف"
                                value={`$${Number(stats.total_expense).toFixed(2)}`}
                                icon={TrendingDown}
                                color="red"
                            />
                            <StatsCard
                                title="صافي الربح"
                                value={`$${Number(stats.net_profit).toFixed(2)}`}
                                icon={Wallet}
                                color="sky"
                            />
                        </div>

                        {/* Actions & Filters */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Menu className="h-5 w-5 text-gray-400" />
                                آخر العمليات
                            </h2>
                            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => setIsEmployeeModalOpen(true)}
                                        className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all duration-200"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        إضافة موظف
                                    </button>
                                )}
                                <button
                                    onClick={handleExportExcel}
                                    className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                >
                                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                    تصدير Excel
                                </button>
                                <button
                                    onClick={() => setIsTransactionModalOpen(true)}
                                    className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-600/30 hover:bg-sky-700 hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Plus className="h-4 w-4" />
                                    عملية جديدة
                                </button>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <TransactionsTable transactions={transactions} />
                    </div>

                    {/* Right Column: Chart */}
                    <div className="lg:col-span-1">
                        <FinancialChart income={stats.total_income} expense={stats.total_expense} />

                        {/* Quick Tips or User Card could go here */}
                        <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl shadow-indigo-500/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-5 w-5 text-yellow-300" />
                                <h3 className="text-lg font-bold">تبي نصيحة؟</h3>
                            </div>
                            <p className="text-indigo-100 text-sm leading-relaxed">
                                حاول تقلل المصاريف الغير ضرورية عشان ترفع صافي الربح. راجع التقارير الشهرية باستمرار!
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                onSuccess={fetchData}
            />
            <AddEmployeeModal
                isOpen={isEmployeeModalOpen}
                onClose={() => setIsEmployeeModalOpen(false)}
            />
        </div>
    );
}
