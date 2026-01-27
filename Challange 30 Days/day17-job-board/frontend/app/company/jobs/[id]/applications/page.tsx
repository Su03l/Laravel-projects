"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    // const { user } = useAuth(); // Unused
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // const router = useRouter(); // Unused

    const { id } = use(params);
    // The ID param now holds the Job Title (or ID) based on the link.
    // We decode it just in case, though for the API call we can pass it directly 
    // or let Axios encode it (prefer passing raw if backend expects decoded, or encoded if backend expects encoded).
    // The backend receives it raw in URL path.

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // We pass the ID (which is the title) to the API. 
                // The API route is /jobs/{id}/applications.
                const { data } = await api.get(`/jobs/${id}/applications`);
                setApplications(data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
                // alert("Unauthorized or Error");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchApplications();
    }, [id]);

    const updateStatus = async (appId: number, newStatus: string) => {
        const toastId = toast.loading("جاري تحديث الحالة...");
        try {
            await api.put(`/applications/${appId}/status`, { status: newStatus });
            // Update local state
            setApplications(apps => apps.map(app => app.id === appId ? { ...app, status: newStatus } : app));
            toast.success(`تم ${newStatus === 'accepted' ? 'قبول' : 'رفض'} الطلب بنجاح ✅`, { id: toastId });
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error("فشل تحديث الحالة", { id: toastId });
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {applications.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="bg-slate-50 p-6 rounded-full mb-6 inline-block">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">لسه ما فيه متقدمين</h3>
                        <p className="max-w-xs mx-auto">انتظر شوي، وراح يوصلك اشعار أول ما يقدم احد.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Link href={`/user/${app.user.name}`}>
                                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden hover:opacity-90 transition-opacity">
                                                {app.user.avatar ? (
                                                    <img src={app.user.avatar} alt={app.user.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    app.user.name.charAt(0)
                                                )}
                                            </div>
                                        </Link>
                                        <div>
                                            <h3 className="font-bold text-slate-900 leading-tight">
                                                <Link href={`/user/${app.user.name}`} className="hover:text-blue-600 transition-colors">
                                                    {app.user.name}
                                                </Link>
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium">{app.user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {translateStatus(app.status)}
                                    </span>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 flex-1">
                                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">رسالة التقديم</p>
                                    <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-4">
                                        &quot;{app.cover_letter || 'لا توجد رسالة مرفقة.'}&quot;
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    {app.status === 'pending' ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => updateStatus(app.id, 'accepted')}
                                                className="flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all active:scale-95 text-sm shadow-lg shadow-green-600/20"
                                            >
                                                قبول المرشح
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app.id, 'rejected')}
                                                className="flex items-center justify-center gap-1.5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all active:scale-95 text-sm"
                                            >
                                                رفض
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={`w-full py-3 rounded-xl font-bold text-sm text-center border ${app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            تم {app.status === 'accepted' ? 'قبول' : 'رفض'} هذا المرشح
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
