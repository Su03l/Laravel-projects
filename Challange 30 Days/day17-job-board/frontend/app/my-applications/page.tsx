"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin, Briefcase, Calendar, Edit2, Trash2, Frown } from "lucide-react";

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.length === 0 ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="bg-slate-50 p-6 rounded-full mb-6">
                            <Frown className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">لسه ما قدمت على أي وظيفة</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">ابدأ رحلة البحث عن وظيفة أحلامك وقدم عليها الآن.</p>
                        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                            تصفح الوظائف الآن
                        </Link>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col relative overflow-hidden group">
                            {/* Status Stripe */}
                            <div className={`h-1.5 w-full ${app.status === 'accepted' ? 'bg-green-500' :
                                app.status === 'rejected' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                }`} />

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">
                                            <Link href={`/jobs/${app.job.id}`} className="hover:text-blue-600 transition-colors line-clamp-1">
                                                {app.job.title}
                                            </Link>
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500">{app.job.company?.name}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${app.status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {translateStatus(app.status)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-slate-500 gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{app.job.location}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <span>{app.job.work_type}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-slate-500 gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span>{new Date(app.created_at).toLocaleDateString('ar-SA')}</span>
                                    </div>
                                </div>

                                {app.cover_letter && (
                                    <div className="mt-auto mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                        <p className="text-xs text-slate-500 line-clamp-2 italic">
                                            &quot;{app.cover_letter}&quot;
                                        </p>
                                    </div>
                                )}

                                {app.status === 'pending' ? (
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                                        <button
                                            onClick={() => openEditModal(app)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1.5 transition-colors p-1"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            تعديل
                                        </button>
                                        <button
                                            onClick={() => handleWithdraw(app.id)}
                                            className="text-red-600 hover:text-red-700 text-sm font-bold flex items-center gap-1.5 transition-colors p-1"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            سحب
                                        </button>
                                    </div>
                                ) : (
                                    <div className="pt-4 border-t border-slate-100 mt-auto">
                                        <p className="text-xs text-center text-slate-400">
                                            تم {app.status === 'accepted' ? 'قبول' : 'رفض'} الطلب
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
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
