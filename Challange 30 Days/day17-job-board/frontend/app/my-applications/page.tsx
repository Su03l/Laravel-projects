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
                                <Frown className="w-8 h-8 text-slate-400" />
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
                                            <div className="mt-1 flex items-center text-sm text-slate-500 gap-3">
                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.job.location}</span>
                                                <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {app.job.work_type}</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(app.created_at).toLocaleDateString('ar-SA')}</span>
                                            </div>
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
                                        <Clock className="w-4 h-4" />
                                        تم التقديم في {new Date(app.created_at).toLocaleDateString('ar-SA')}
                                    </div>
                                    {app.cover_letter && (
                                        <div className="mt-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                                            &quot;{app.cover_letter}&quot;
                                        </div>
                                    )}
                                    {app.status === 'pending' && (
                                        <div className="mt-5 flex space-x-4 space-x-reverse">
                                            <button
                                                onClick={() => openEditModal(app)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                تعديل الرسالة
                                            </button>
                                            <button
                                                onClick={() => handleWithdraw(app.id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
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
