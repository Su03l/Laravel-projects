import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { Award, Download, Eye, Calendar, User, X, GraduationCap, ExternalLink, Trophy } from 'lucide-react';

interface Certificate {
    id: number;
    course_id: number;
    title: string;
    instructor: string;
    date: string;
    image: string;
}

interface Props {
    certificates: Certificate[];
}

export default function Certificates({ certificates }: Props) {
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
    const { auth } = usePage().props as any;

    return (
        <AuthenticatedLayout>
            <Head title="شهاداتي" />

            <div className="max-w-7xl mx-auto font-['Cairo']" dir="rtl">
                {/* Header Section with Stats */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-zinc-100 pb-10">
                    <div className="text-right">
                        <div className="inline-flex items-center gap-2 bg-[#00D1FF]/10 text-[#00D1FF] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <Trophy className="w-4 h-4" />
                            سجل الإنجازات
                        </div>
                        <h1 className="text-4xl font-black text-black mb-2">شهاداتي المكتسبة</h1>
                        <p className="text-zinc-500 font-bold">استعرض وحمل شهاداتك المعتمدة التي حصلت عليها.</p>
                    </div>

                    <div className="bg-black rounded-3xl p-6 text-white flex items-center gap-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#00D1FF]/10 blur-2xl rounded-full"></div>
                        <div className="relative z-10">
                            <p className="text-zinc-400 text-xs font-black uppercase tracking-tighter mb-1">إجمالي الشهادات</p>
                            <p className="text-3xl font-black text-[#00D1FF]">{certificates.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-[#00D1FF]/20 rounded-2xl flex items-center justify-center relative z-10">
                            <Award className="w-7 h-7 text-[#00D1FF]" />
                        </div>
                    </div>
                </div>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="bg-white rounded-[35px] border border-zinc-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 group flex flex-col h-full">
                                {/* Certificate Image/Preview Area */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                                    <img
                                        src={cert.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                        <div className="flex gap-2 w-full">
                                            <button
                                                onClick={() => setSelectedCert(cert)}
                                                className="flex-1 bg-white/20 backdrop-blur-md text-white py-2.5 rounded-xl font-black text-xs hover:bg-[#00D1FF] hover:text-black transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                معاينة سريعة
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-black/80 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
                                            <Award className="w-5 h-5 text-[#00D1FF]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="font-black text-xl mb-4 line-clamp-2 group-hover:text-[#00D1FF] transition-colors min-h-[3.5rem] leading-tight">
                                        {cert.title}
                                    </h3>

                                    <div className="space-y-3 mb-8 text-sm font-bold">
                                        <div className="flex items-center gap-3 text-zinc-500 flex-row-reverse justify-end">
                                            <User className="w-4 h-4 text-zinc-300" />
                                            <span>المدرب: {cert.instructor}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-zinc-500 flex-row-reverse justify-end">
                                            <Calendar className="w-4 h-4 text-zinc-300" />
                                            <span>تاريخ الإنجاز: {cert.date}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-auto pt-6 border-t border-zinc-50 flex items-center gap-3">
                                        <a
                                            href={`/certificates/${cert.id}/download`}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-black text-white rounded-2xl font-black text-sm hover:shadow-[0_0_209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                                        >
                                            <Download className="w-4 h-4 text-[#00D1FF]" />
                                            تحميل PDF
                                        </a>
                                        <Link
                                            href={`/certificates/${cert.id}/view-html`}
                                            target="_blank"
                                            className="w-12 h-12 flex items-center justify-center bg-zinc-50 text-zinc-400 border border-zinc-100 rounded-2xl hover:bg-white hover:text-[#00D1FF] hover:border-[#00D1FF] transition-all shrink-0"
                                            title="فتح في صفحة جديدة"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[50px] p-24 text-center">
                        <div className="bg-white w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-sm">
                            <Award className="w-12 h-12 text-zinc-300" />
                        </div>
                        <h3 className="text-2xl font-black mb-3">لا توجد شهادات بعد</h3>
                        <p className="text-zinc-500 font-bold mb-10 text-lg">أكمل دورتك الأولى بنسبة 100% لتحصل على شهادتك المعتمدة وتظهر هنا.</p>
                        <Link href="/my-learning" className="bg-black text-white px-10 py-4 rounded-2xl font-black text-lg hover:shadow-[0_0_25px_rgba(0,209,255,0.4)] transition-all inline-block">
                            واصل التعلم الآن
                        </Link>
                    </div>
                )}
            </div>

            {/* Preview Modal (New Fixed Layout Design) */}
            {selectedCert && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] max-w-4xl w-full overflow-hidden shadow-2xl relative">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-black p-2 rounded-xl">
                                    <GraduationCap className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="font-black text-lg">معاينة الشهادة</h2>
                            </div>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-zinc-400 hover:text-black"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content - Fixed Layout Preview */}
                        <div className="p-8 bg-zinc-100 flex justify-center overflow-y-auto max-h-[70vh]">
                            <div className="bg-white w-full max-w-[600px] aspect-[1/1.414] shadow-2xl relative overflow-hidden font-sans" dir="ltr">
                                {/* Corner Decorations */}
                                <div className="absolute top-[20px] left-[20px] w-16 h-16 border-t-4 border-l-4 border-[#00D1FF]"></div>
                                <div className="absolute bottom-[20px] right-[20px] w-16 h-16 border-b-4 border-r-4 border-[#00D1FF]"></div>
                                <div className="absolute inset-[30px] border border-[#00D1FF]/30"></div>

                                <div className="relative z-10 p-12 text-center h-full flex flex-col justify-center">
                                    <div className="bg-[#00D1FF] text-white w-12 h-12 leading-[48px] text-2xl font-black mx-auto mb-4 rounded-lg">E</div>
                                    <div className="text-xl font-bold mb-8 tracking-tight">EDU<span className="text-[#00D1FF]">CORE</span></div>

                                    <h1 className="text-4xl font-black mb-1 tracking-tighter text-black">CERTIFICATE</h1>
                                    <p className="text-[#00D1FF] font-bold text-xs tracking-[4px] mb-10 uppercase">of appreciation</p>

                                    <p className="text-zinc-400 text-xs mb-2 uppercase">This certificate is proudly presented to</p>
                                    <div className="text-3xl font-black text-black border-b-4 border-[#00D1FF] inline-block mx-auto px-8 pb-2 mb-8">
                                        {auth.user.name}
                                    </div>

                                    <p className="text-sm text-zinc-600 leading-relaxed px-10">
                                        In recognition of successfully completing all requirements for the professional course:
                                        <span className="text-black font-bold block mt-2 text-lg">"{selectedCert.title}"</span>
                                    </p>

                                    <div className="mt-16 flex justify-between items-end px-10">
                                        <div className="text-center w-32">
                                            <div className="border-t-2 border-black pt-2">
                                                <p className="text-[8px] font-bold text-black uppercase">Academy Director</p>
                                            </div>
                                        </div>
                                        <div className="text-center w-32">
                                            <div className="border-t-2 border-black pt-2">
                                                <p className="text-[8px] font-bold text-black uppercase">Lead Instructor</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-8 left-0 right-0 text-[8px] text-zinc-400 font-bold uppercase tracking-widest">
                                        Issued on {selectedCert.date} | Certificate ID: CERT-{selectedCert.id}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-zinc-100 flex justify-center gap-4 bg-white">
                            <a
                                href={`/certificates/${selectedCert.id}/download`}
                                className="flex items-center justify-center gap-2 px-10 py-4 bg-black text-white rounded-2xl font-black hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                            >
                                <Download className="w-5 h-5 text-[#00D1FF]" />
                                تحميل الشهادة (PDF)
                            </a>
                            <button
                                onClick={() => setSelectedCert(null)}
                                className="px-10 py-4 bg-zinc-50 text-zinc-500 rounded-2xl font-black hover:bg-zinc-100 transition-all"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
