import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Play,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Menu,
    X,
    GraduationCap,
    Settings as SettingsIcon,
    FileText,
    MessageSquare,
    Trophy,
    Award,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

interface Props {
    course: any;
    currentLesson: any;
    navigation: {
        prev_id: number | null;
        next_id: number | null;
    };
    progress: {
        percentage: number;
    };
}

export default function Learn({ course, currentLesson, navigation, progress }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    useEffect(() => {
        if (progress.percentage === 100) {
            setShowCompletionModal(true);
        }
    }, [progress.percentage]);

    const handleLessonChange = (lessonId: number) => {
        router.visit(route('learn', { course: course.id, lesson: lessonId }));
    };

    const markAsComplete = () => {
        router.post(route('lessons.complete', currentLesson.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="h-screen bg-white flex flex-col font-['Cairo'] overflow-hidden relative" dir="rtl">
            <Head title={`تعلم: ${course.title}`} />

            {/* Completion Modal */}
            {showCompletionModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl border border-zinc-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[#00D1FF] to-transparent"></div>
                        <div className="bg-black w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(0,209,255,0.4)] rotate-3">
                            <Trophy className="w-12 h-12 text-[#00D1FF]" />
                        </div>
                        <h2 className="text-3xl font-black mb-4">تهانينا! 🎉</h2>
                        <p className="text-zinc-500 font-bold mb-10 leading-relaxed">
                            لقد أتممت دورة <span className="text-black">"{course.title}"</span> بنجاح. نحن فخورون جداً بإنجازك!
                        </p>
                        <div className="space-y-4">
                            <Link href="/my-learning" className="flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-2xl font-black hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all group">
                                العودة لدروسي
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/certificates" className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-50 text-black border border-zinc-200 rounded-2xl font-black hover:bg-white hover:border-[#00D1FF] transition-all">
                                <Award className="w-5 h-5 text-[#00D1FF]" />
                                عرض الشهادات
                            </Link>
                        </div>
                        <button onClick={() => setShowCompletionModal(false)} className="mt-8 text-zinc-400 text-sm font-bold hover:text-black transition-colors">إغلاق النافذة</button>
                    </div>
                </div>
            )}

            {/* Classroom Header */}
            <header className="h-16 border-b border-zinc-100 bg-black text-white flex items-center justify-between px-6 shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/my-learning" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                    <div className="h-6 w-px bg-zinc-800 mx-2"></div>
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#00D1FF]" />
                        <span className="font-bold text-sm hidden md:block">{course.title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 ml-4">
                        <div className="text-left">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">تقدمك في الدورة</p>
                            <p className="text-xs font-bold text-right">{progress.percentage}%</p>
                        </div>
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#00D1FF] transition-all duration-500" style={{ width: `${progress.percentage}%` }}></div>
                        </div>
                    </div>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Curriculum Sidebar */}
                <aside className={`w-80 border-l border-zinc-100 bg-white flex flex-col transition-all duration-300 shrink-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full hidden'}`}>
                    <div className="p-6 border-b border-zinc-100 text-right shrink-0">
                        <h3 className="font-black text-lg">محتوى الدورة</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {course.chapters.map((chapter: any, i: number) => (
                            <div key={i}>
                                <div className="bg-zinc-50 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-zinc-100 text-right sticky top-0 z-10">
                                    الفصل {i + 1}: {chapter.title}
                                </div>
                                <div className="divide-y divide-zinc-50">
                                    {chapter.lessons.map((lesson: any) => (
                                        <button key={lesson.id} onClick={() => handleLessonChange(lesson.id)} className={`w-full px-6 py-4 flex items-start gap-3 text-right transition-all hover:bg-zinc-50 ${lesson.active ? 'bg-[#00D1FF]/5 border-r-4 border-[#00D1FF]' : ''}`}>
                                            <div className="mt-0.5 shrink-0">
                                                {lesson.completed ? <CheckCircle2 className="w-4 h-4 text-[#00D1FF] fill-[#00D1FF]/10" /> : <div className={`w-4 h-4 rounded-full border-2 ${lesson.active ? 'border-[#00D1FF]' : 'border-zinc-300'}`}></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold leading-tight mb-1 truncate ${lesson.active ? 'text-black' : 'text-zinc-600'}`}>{lesson.title}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold flex-row-reverse justify-end">
                                                    <Play className="w-3 h-3" />
                                                    {lesson.duration}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Video Player Area */}
                <main className="flex-1 overflow-y-auto bg-zinc-50 custom-scrollbar">
                    {currentLesson ? (
                        <div className="max-w-5xl mx-auto">
                            <div className="aspect-video bg-black w-full relative group shadow-2xl">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-[#00D1FF] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,209,255,0.4)] mb-4 cursor-pointer hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-black fill-current ml-1" />
                                        </div>
                                        <p className="text-white/50 text-sm font-bold">انقر لتشغيل الدرس</p>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center justify-between flex-row-reverse">
                                        <div className="flex items-center gap-4 flex-row-reverse">
                                            <button className="text-white hover:text-[#00D1FF]"><Play className="w-5 h-5 fill-current" /></button>
                                            <div className="text-xs text-white font-bold">00:00 / {currentLesson.duration || '05:00'}</div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-row-reverse">
                                            <button className="text-white hover:text-[#00D1FF] text-xs font-black">1.0x</button>
                                            <button className="text-white hover:text-[#00D1FF]"><SettingsIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 text-right">
                                {/* Navigation & Actions */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                    <div className="text-right">
                                        <h2 className="text-2xl font-black mb-2">{currentLesson.title}</h2>
                                        <p className="text-zinc-500 text-sm font-bold">مدة الدرس: {currentLesson.duration || '5 دقائق'}</p>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        {/* Previous Lesson */}
                                        <button
                                            onClick={() => navigation.prev_id && handleLessonChange(navigation.prev_id)}
                                            disabled={!navigation.prev_id}
                                            className="px-5 py-3 rounded-xl font-bold text-sm bg-white border border-zinc-200 text-zinc-600 hover:border-black hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                            الدرس السابق
                                        </button>

                                        {/* Mark as Complete */}
                                        <button
                                            onClick={markAsComplete}
                                            disabled={currentLesson.completed}
                                            className={`px-6 py-3 rounded-xl font-black text-sm flex items-center gap-2 transition-all border border-transparent ${
                                                currentLesson.completed
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 cursor-default'
                                                : 'bg-black text-white hover:shadow-[0_0_15px_rgba(0,209,255,0.4)] hover:border-[#00D1FF]'
                                            }`}
                                        >
                                            <CheckCircle2 className={`w-5 h-5 ${currentLesson.completed ? 'text-emerald-500' : 'text-[#00D1FF]'}`} />
                                            {currentLesson.completed ? 'تم إكمال الدرس' : 'تحديد كمكتمل'}
                                        </button>

                                        {/* Next Lesson */}
                                        <button
                                            onClick={() => navigation.next_id && handleLessonChange(navigation.next_id)}
                                            disabled={!navigation.next_id}
                                            className="px-5 py-3 rounded-xl font-bold text-sm bg-white border border-zinc-200 text-zinc-600 hover:border-black hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            الدرس التالي
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex border-b border-zinc-200 mb-8 flex-row-reverse">
                                    {[
                                        { id: 'overview', label: 'نظرة عامة', icon: <FileText className="w-4 h-4" /> },
                                        { id: 'resources', label: 'المصادر', icon: <SettingsIcon className="w-4 h-4" /> },
                                        { id: 'discussions', label: 'المناقشات', icon: <MessageSquare className="w-4 h-4" /> }
                                    ].map((tab, i) => (
                                        <button key={tab.id} className={`px-6 py-4 text-sm font-black transition-all relative flex items-center gap-2 ${i === 0 ? 'text-black' : 'text-zinc-400 hover:text-black'}`}>
                                            {tab.icon}
                                            {tab.label}
                                            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00D1FF]"></div>}
                                        </button>
                                    ))}
                                </div>

                                <div className="prose prose-zinc max-w-none text-right">
                                    <p className="text-zinc-600 leading-relaxed font-bold">
                                        في هذا الدرس، سنتناول المفاهيم الأساسية والمتقدمة المتعلقة بـ {currentLesson.title}.
                                        ستتعلم كيفية تطبيق هذه المهارات في مشاريعك الحقيقية وتحسين جودة الكود الخاص بك.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-zinc-500 font-bold text-lg">لا يوجد محتوى متاح لهذا الدرس حالياً.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
