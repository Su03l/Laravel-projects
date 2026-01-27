"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CompanyDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Job Creation State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        location: "",
        work_type: "full-time",
        salary: "",
        tags: "", // Comma separated for input
    });
    const [creating, setCreating] = useState(false);


    const fetchMyJobs = async () => {
        try {
            const { data } = await api.get("/jobs?limit=100");
            if (user) {
                const myJobs = data.data.filter((job: any) => job.company?.id === user.id || job.user_id === user.id);
                setJobs(myJobs);
            }
        } catch (error) {
            console.error("Error fetching jobs", error);
            toast.error("حدث خطأ أثناء تحميل الوظائف");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.type !== 'company') {
                router.push('/');
                return;
            }
            fetchMyJobs();
        }
    }, [user, authLoading, router]);

    const handleCreateJob = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        const toastId = toast.loading("جاري نشر الوظيفة...");
        try {
            const payload = {
                ...newJob,
                tags: newJob.tags.split(',').map(t => t.trim()).filter(t => t)
            };
            await api.post('/jobs', payload);
            setIsModalOpen(false);
            setNewJob({ title: "", description: "", location: "", work_type: "full-time", salary: "", tags: "" });
            fetchMyJobs();
            toast.success("تم نشر الوظيفة بنجاح! 🚀", { id: toastId });
        } catch (error) {
            toast.error("فشل نشر الوظيفة، تأكد من البيانات", { id: toastId });
        } finally {
            setCreating(false);
        }
    }

    const translateWorkType = (type: string) => {
        const types: any = {
            'full-time': 'دوام كامل',
            'part-time': 'دوام جزئي',
            'contract': 'عقد',
            'freelance': 'فريلانس',
        }
        return types[type] || type;
    }

    if (authLoading) return <div className="p-10 text-center">جاري التحميل...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم</h1>
                    <p className="text-slate-500 mt-1">مرحباً {user?.name}، أدر وظائفك من هنا.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    نشر وظيفة جديدة
                </button>
            </div>

            <div className="bg-white shadow-sm overflow-hidden sm:rounded-2xl border border-slate-200">
                <ul role="list" className="divide-y divide-gray-100">
                    {jobs.length === 0 ? (
                        <li className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                            <div className="bg-slate-50 p-4 rounded-full mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.637-1.292-.172-.061-.322-.157-.456-.282m0 0a2.18 2.18 0 01-.75-1.661V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                                </svg>
                            </div>
                            لسه ما نشرت أي وظيفة.
                        </li>
                    ) : (
                        jobs.map((job) => (
                            <li key={job.id}>
                                <div className="px-6 py-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">
                                            <Link href={`/jobs/${job.id}`} className="hover:text-blue-600 transition-colors">{job.title}</Link>
                                        </h3>
                                        <div className="mt-1 flex items-center text-sm text-slate-500 gap-3">
                                            <span>📍 {job.location}</span>
                                            <span>💼 {translateWorkType(job.work_type)}</span>
                                            <span>📅 {new Date(job.created_at).toLocaleDateString('ar-SA')}</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3 space-x-reverse">
                                        <Link
                                            href={`/company/jobs/${job.id}/applications`}
                                            className="inline-flex items-center px-4 py-2 border border-slate-200 text-sm font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
                                        >
                                            عرض المتقدمين
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            {/* Create Job Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">نشر وظيفة جديدة</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                        </div>

                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">المسمى الوظيفي</label>
                                <input type="text" required className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50"
                                    value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} placeholder="مثال: مصمم واجهات" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">الوصف الوظيفي</label>
                                <textarea required className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 h-32 bg-slate-50"
                                    value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} placeholder="اكتب تفاصيل الوظيفة والمهام..." ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الموقع</label>
                                    <input type="text" required className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50"
                                        value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} placeholder="الرياض، عن بعد..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الراتب (اختياري)</label>
                                    <input type="text" className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50"
                                        value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} placeholder="5000 - 8000" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">نوع العمل</label>
                                    <select className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50"
                                        value={newJob.work_type} onChange={e => setNewJob({ ...newJob, work_type: e.target.value })}
                                    >
                                        <option value="full-time">دوام كامل</option>
                                        <option value="part-time">دوام جزئي</option>
                                        <option value="contract">عقد</option>
                                        <option value="freelance">مستقل</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">المهارات (افصل بينها بفاصلة)</label>
                                    <input type="text" required placeholder="react, laravel, design" className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 bg-slate-50"
                                        value={newJob.tags} onChange={e => setNewJob({ ...newJob, tags: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium">إلغاء</button>
                                <button type="submit" disabled={creating} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold disabled:opacity-50">نشر الوظيفة</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
