"use client";

import { useEffect, useState, use } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth();
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: string; text: string } | null>(
        null
    );

    const { id } = use(params);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await api.get(`/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error("Failed to fetch job", error);
                router.push("/");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, router]);

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            await api.post(`/jobs/${id}/apply`, { cover_letter: coverLetter });
            setMessage({ type: "success", text: "تم إرسال طلبك بنجاح! فالك التوفيق" });
            setTimeout(() => {
                setIsModalOpen(false);
                setCoverLetter("");
                setMessage(null);
            }, 2000);
        } catch (error: any) {
            setMessage({
                type: "error",
                text: error.response?.data?.message || "صار خطأ أثناء التقديم، حاول مرة ثانية",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const translateWorkType = (type: string) => {
        const types: any = {
            'full-time': 'دوام كامل',
            'part-time': 'دوام جزئي',
            'contract': 'عقد',
            'freelance': 'فريلانس',
        }
        return types[type] || type;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="mb-6">
                        <Link href="/" className="text-slate-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1 transition-colors">
                            <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            العودة للوظائف
                        </Link>
                    </div>
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-inner border border-blue-100">
                                {job.company?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{job.title}</h1>
                                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5 text-slate-700">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        {job.company?.name}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {job.location}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        {new Date(job.created_at).toLocaleDateString('ar-SA')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-bottom-5 duration-700">
                    {/* Description Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">تفاصيل الوظيفة</h2>
                        <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line text-right">
                            {job.description}
                        </div>
                    </div>

                    {/* Tags Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">المهارات المطلوبة</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.tags?.map((tag: any) => (
                                <span key={tag.id} className="inline-flex items-center rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Sticky Action Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 sticky top-24 transform transition-all">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">عجبتك الوظيفة؟</h3>
                            <p className="text-sm text-slate-500">قدم عليها الحين ولا تفوت الفرصة.</p>
                        </div>

                        {job.salary && (
                            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800">الراتب المتوقع</span>
                                <span className="text-lg font-bold text-green-700">${job.salary}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-slate-100/50">
                                <span className="text-slate-500 text-sm">نوع العمل</span>
                                <span className="font-medium text-slate-900 capitalize">{translateWorkType(job.work_type)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100/50">
                                <span className="text-slate-500 text-sm">الخبرة</span>
                                <span className="font-medium text-slate-900">متوسط - خبير</span>
                            </div>
                        </div>

                        <div className="mt-8">
                            {user?.type === "seeker" ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    قدم الآن
                                    <svg className="w-5 h-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                                </button>
                            ) : !user ? (
                                <Link href="/login" className="w-full block text-center bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                                    سجل دخول عشان تقدم
                                </Link>
                            ) : (
                                <div className="text-center p-3 bg-slate-50 rounded-lg text-sm text-slate-500">
                                    حساب شركات (للمشاهدة فقط)
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Info (Optional) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">عن الشركة</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                {job.company?.name?.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{job.company?.name}</div>
                                <Link href={`/user/${job.company?.name}`} className="text-blue-600 text-sm hover:underline">عرض الملف</Link>
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed">
                            {job.company?.bio || "شركة رائدة في مجالها، تبحث عن أفضل المواهب للانضمام لفريقها المبدع."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-0 overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">التقديم على {job.title}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div className={`p-4 rounded-xl mb-6 text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleApply}>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        رسالة التغطية (Cover Letter) <span className="text-slate-400 font-normal">(اختياري)</span>
                                    </label>
                                    <textarea
                                        className="w-full border-slate-200 bg-slate-50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[160px] p-4 text-slate-800 placeholder:text-slate-400 border transition-all resize-none text-right"
                                        placeholder="عرف بنفسك وليش تشوف انك مناسب لهذي الوظيفة..."
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                                        disabled={submitting}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                جاري الارسال...
                                            </span>
                                        ) : "إرسال الطلب"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
