"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { MapPin, Briefcase, Calendar } from "lucide-react";

export default function CompanyDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Restored
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
                salary: newJob.salary === "" ? null : newJob.salary,
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="bg-slate-50 p-6 rounded-full mb-6">
                            <Briefcase className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">لسه ما نشرت أي وظيفة</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">ابدأ الآن وابحث عن أفضل الكفاءات لفريقك.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                        >
                            نشر أول وظيفة
                        </button>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 z-0 opacity-50 group-hover:scale-110 transition-transform" />

                            <div className="p-6 relative z-10 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 leading-snug mb-1 line-clamp-1">
                                        <Link href={`/jobs/${job.id}`} className="hover:text-blue-600 transition-colors">
                                            {job.title}
                                        </Link>
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {job.location}
                                    </p>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">نوع العمل</span>
                                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                                            {translateWorkType(job.work_type)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">تاريخ النشر</span>
                                        <span className="font-bold text-slate-700 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(job.created_at).toLocaleDateString('ar-SA')}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <Link
                                        href={`/company/jobs/${encodeURIComponent(job.title)}/applications`}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 text-slate-700 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all group-active:scale-95"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                        </svg>
                                        عرض المتقدمين
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
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
