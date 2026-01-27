"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { id } = use(params);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get(`/jobs/${id}/applications`);
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
            // alert("Unauthorized or Error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [id]);

    const updateStatus = async (appId: number, newStatus: string) => {
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            // Update local state
            setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("فشل تحديث الحالة");
        }
    }

    const translateStatus = (status: string) => {
        const statuses: any = {
            'pending': 'قيد المراجعة',
            'accepted': 'مقبول',
            'rejected': 'مرفوض',
        }
        return statuses[status] || status;
    }

    if (loading) return <div className="p-10 text-center">جاري تحميل الطلبات...</div>;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <Link href="/company/dashboard" className="text-slate-500 hover:text-blue-600 font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transform rotate-180">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    العودة للوحة التحكم
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">المتقدمين ({applications.length})</h1>
            </div>

            <div className="bg-white shadow-sm overflow-hidden sm:rounded-2xl border border-slate-200">
                {applications.length === 0 ? (
                    <div className="p-20 text-center text-slate-500">
                        <div className="bg-slate-50 p-4 rounded-full mb-4 inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">لسه ما فيه متقدمين</h3>
                        <p className="mt-1">انتظر شوي وتجيك الطلبات.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">المرشح</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">رسالة التقديم</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                                {app.user.name.charAt(0)}
                                            </div>
                                            <div className="mr-4">
                                                <div className="text-sm font-bold text-slate-900">{app.user.name}</div>
                                                <div className="text-sm text-slate-500">{app.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600 max-w-xs truncate" title={app.cover_letter}>{app.cover_letter || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border 
                            ${app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                                app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                            {translateStatus(app.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                        {app.status === 'pending' && (
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => updateStatus(app.id, 'accepted')} className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg border border-green-200 transition-colors">قبول</button>
                                                <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 transition-colors">رفض</button>
                                            </div>
                                        )}
                                        {app.status !== 'pending' && (
                                            <span className="text-slate-400 text-xs font-medium bg-slate-100 px-3 py-1.5 rounded-lg">تم الرد</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
