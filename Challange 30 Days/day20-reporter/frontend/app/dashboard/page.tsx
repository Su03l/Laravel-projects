'use client';

import FinancialChart from '@/components/FinancialChart';
import StatsCard from '@/components/StatsCard';
import TransactionsTable from '@/components/TransactionsTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddEmployeeModal from '@/components/AddEmployeeModal';
import { Wallet, TrendingUp, TrendingDown, Plus, FileSpreadsheet, UserPlus, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({ total_income: 0, total_expense: 0, net_profit: 0 });
    // ... existing state ...

    // ... existing useEffects and functions ...

    if (isLoading || !user) {
        return <div className="flex min-h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header / Navbar */}
            <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-sky-600 rounded-lg flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">Financial Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block">Logged in as <span className="font-medium text-gray-900 capitalize">{user.role}</span></span>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatsCard
                            title="Total Income"
                            value={`$${Number(stats.total_income).toFixed(2)}`}
                            icon={TrendingUp}
                            color="green"
                        />
                        <StatsCard
                            title="Total Expense"
                            value={`$${Number(stats.total_expense).toFixed(2)}`}
                            icon={TrendingDown}
                            color="red"
                        />
                        <StatsCard
                            title="Net Profit"
                            value={`$${Number(stats.net_profit).toFixed(2)}`}
                            icon={Wallet}
                            color="sky"
                        />
                        {/* Chart Section - Inline with stats on large or below? 
                            Let's put chart in the third column of the main grid if we make stats take 2 cols?
                            Actually, 3 stats cards fit nicely in one row.
                            Let's keep Stats in one row, and Chart below it.
                         */}
                    </div>
                    {/* Move Chart here if we want side by side, but 3 stats take width.
                        Let's revert the complex grid and just stack them.
                     */}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatsCard
                                title="Total Income"
                                value={`$${Number(stats.total_income).toFixed(2)}`}
                                icon={TrendingUp}
                                color="green"
                            />
                            <StatsCard
                                title="Total Expense"
                                value={`$${Number(stats.total_expense).toFixed(2)}`}
                                icon={TrendingDown}
                                color="red"
                            />
                            <StatsCard
                                title="Net Profit"
                                value={`$${Number(stats.net_profit).toFixed(2)}`}
                                icon={Wallet}
                                color="sky"
                            />
                        </div>

                        {/* Actions & Filters */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
                            <div className="flex flex-wrap gap-3">
                                {user.role === 'admin' && (
                                    <button
                                        onClick={() => setIsEmployeeModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 transition-all font-sans"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add Employee
                                    </button>
                                )}
                                <button
                                    onClick={handleExportExcel}
                                    className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all font-sans"
                                >
                                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                    Export Excel
                                </button>
                                <button
                                    onClick={() => setIsTransactionModalOpen(true)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-500 shadow-sky-600/30 transition-all font-sans"
                                >
                                    <Plus className="h-4 w-4" />
                                    New Transaction
                                </button>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <TransactionsTable transactions={transactions} />
                    </div>

                    <div className="lg:col-span-1">
                        <FinancialChart income={stats.total_income} expense={stats.total_expense} />
                    </div>
                </div>

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
