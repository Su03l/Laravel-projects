'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Users, Briefcase, DollarSign, FolderKanban, Clock, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface DashboardStats {
    employeesCount: number;
    activeProjects: number;
    netProfit: string; // or number depending on API
    // Add other expected fields
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const response = await api.get('/dashboard');
            setStats(response.data); // Adjust based on actual API response structure
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
            // Fallback mock data for demonstration if API fails or is empty initially
            setStats({
                employeesCount: 12,
                activeProjects: 5,
                netProfit: '$45,200',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleAttendance = async (type: 'check-in' | 'check-out') => {
        try {
            await api.post(`/attendance/${type}`);
            toast.success(`Successfully ${type === 'check-in' ? 'Checked In' : 'Checked Out'}!`);
            // Refresh stats if attendance affects them
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || `Failed to ${type}`);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10`}>
                <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                    <p className="text-slate-500">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => handleAttendance('check-in')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-2"
                    >
                        <Clock size={18} /> Check In
                    </Button>
                    <Button
                        variant="danger" // Using the variant I added to Button.tsx
                        onClick={() => handleAttendance('check-out')}
                        className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
                    >
                        <CheckCircle size={18} /> Check Out
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Total Employees"
                    value={stats?.employeesCount || 0}
                    icon={Users}
                    colorClass="bg-sky-500 text-sky-500"
                />
                <StatCard
                    title="Active Projects"
                    value={stats?.activeProjects || 0}
                    icon={FolderKanban}
                    colorClass="bg-indigo-500 text-indigo-500"
                />
                <StatCard
                    title="Net Profit"
                    value={stats?.netProfit || '$0'}
                    icon={DollarSign}
                    colorClass="bg-emerald-500 text-emerald-500"
                />
            </div>

            {/* Placeholder for Recent Activity or Charts */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                <div className="text-slate-400 text-sm text-center py-8">
                    No recent activity to display.
                </div>
            </div>
        </div>
    );
}
