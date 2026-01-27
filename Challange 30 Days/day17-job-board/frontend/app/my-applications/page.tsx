"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin, Briefcase, Calendar, Clock, CheckCircle, XCircle, Edit2, Trash2, Frown } from "lucide-react";

export default function MyApplicationsPage() {
    const { user, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [editingApp, setEditingApp] = useState<any | null>(null);
    const [editCoverLetter, setEditCoverLetter] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get("/my-applications");
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.type !== 'seeker') {
                router.push('/');
                return;
            }
            fetchApplications();
        }
    }, [user, authLoading, router]);

    const handleWithdraw = async (id: number) => {
        if (!confirm("متأكد تبي تسحب طلبك؟")) return;
        const toastId = toast.loading("جاري سحب الطلب...");
        try {
            await api.delete(`/applications/${id}`);
            setApplications(apps => apps.filter(app => app.id !== id));
            toast.success("تم سحب الطلب", { id: toastId });
        } catch (error) {
            toast.error("فشل سحب الطلب", { id: toastId });
        }
    }

    const openEditModal = (app: any) => {
        setEditingApp(app);
        setEditCoverLetter(app.cover_letter || "");
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingApp) return;
        setUpdating(true);
        const toastId = toast.loading("جاري تحديث الطلب...");
        try {
            await api.put(`/applications/${editingApp.id}`, { cover_letter: editCoverLetter });
            setApplications(apps => apps.map(app => app.id === editingApp.id ? { ...app, cover_letter: editCoverLetter } : app));
            setEditingApp(null);
            toast.success("تم تحديث الرسالة بنجاح! 👍", { id: toastId });
        } catch (error) {
            toast.error("فشل تحديث الطلب", { id: toastId });
        } finally {
            setUpdating(false);
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

    if (authLoading || loading) return <div className="p-10 text-center">جاري التحميل...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">طلباتي</h1>

            <div className="bg-white shadow-sm overflow-hidden sm:rounded-2xl border border-slate-200">
                <ul role="list" className="divide-y divide-gray-100">
                    {applications.length === 0 ? (
                        <li className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            لسه ما قدمت على أي وظيفة.
                            <Link href="/" className="text-blue-600 font-bold mt-2 hover:underline block">تصفح الوظائف الآن</Link>
                        </li>
                    ) : (
                        applications.map((app) => (
                            <li key={app.id}>
                                <div className="px-6 py-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold leading-6 text-slate-900">
                                                <Link href={`/jobs/${app.job.id}`} className="hover:text-blue-600 transition-colors">
                                                    {app.job.title}
                                                </Link>
                                            </h3>
                                            <p className="text-sm font-medium text-slate-500 mt-1">{app.job.company?.name}</p>
                                        </div>
                                        <div className="mr-2 flex-shrink-0 flex">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border 
                        ${app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                {translateStatus(app.status)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-slate-400 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        تم التقديم في {new Date(app.created_at).toLocaleDateString('ar-SA')}
                                    </div>
                                    {app.cover_letter && (
                                        <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                                            "{app.cover_letter}"
                                        </div>
                                    )}
                                    {app.status === 'pending' && (
                                        <div className="mt-5 flex space-x-4 space-x-reverse">
                                            <button
                                                onClick={() => openEditModal(app)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                                تعديل الرسالة
                                            </button>
                                            <button
                                                onClick={() => handleWithdraw(app.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                                سحب الطلب
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Edit Modal */}
            {editingApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-900">تعديل رسالة التقديم</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <textarea
                                    className="w-full border-slate-200 bg-slate-50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] p-4 text-right border"
                                    value={editCoverLetter}
                                    onChange={(e) => setEditCoverLetter(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingApp(null)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                                    disabled={updating}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold disabled:opacity-50"
                                    disabled={updating}
                                >
                                    {updating ? "جاري الحفظ..." : "حفظ التعديلات"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
