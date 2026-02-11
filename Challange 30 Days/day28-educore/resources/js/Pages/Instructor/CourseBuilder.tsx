import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import {
    Plus,
    GripVertical,
    Trash2,
    Edit2,
    ChevronDown,
    Video,
    Eye,
    CheckCircle2,
    X,
    Layout
} from 'lucide-react';

interface Props {
    course: any;
}

export default function CourseBuilder({ course }: Props) {
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [showLessonModal, setShowLessonModal] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [activeChapterId, setActiveChapterId] = useState<number | null>(null);

    const handleAddChapter = (e: React.FormEvent) => {
        e.preventDefault();
        if (newChapterTitle.trim()) {
            router.post(route('instructor.chapters.store', course.id), {
                title: newChapterTitle
            }, {
                onSuccess: () => {
                    setShowChapterModal(false);
                    setNewChapterTitle('');
                }
            });
        }
    };

    const handleAddLesson = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLessonTitle.trim() && activeChapterId) {
            router.post(route('instructor.lessons.store', activeChapterId), {
                title: newLessonTitle
            }, {
                onSuccess: () => {
                    setShowLessonModal(false);
                    setNewLessonTitle('');
                    setActiveChapterId(null);
                }
            });
        }
    };

    const deleteChapter = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الفصل وجميع دروسه؟')) {
            router.delete(route('instructor.chapters.destroy', id));
        }
    };

    const deleteLesson = (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
            router.delete(route('instructor.lessons.destroy', id));
        }
    };

    const togglePublish = () => {
        router.post(route('instructor.courses.publish', course.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`بناء: ${course.title}`} />

            <div className="max-w-5xl mx-auto font-['Cairo']" dir="rtl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-right">
                    <div>
                        <h1 className="text-3xl font-black mb-2 text-black">باني الدورات</h1>
                        <p className="text-zinc-500 font-bold">إدارة محتوى: <span className="text-black">{course.title}</span></p>
                    </div>
                    <div className="flex items-center gap-3 flex-row-reverse">
                        <Link
                            href={route('courses.show', course.id)}
                            className="bg-zinc-100 text-black px-6 py-3 rounded-2xl font-black hover:bg-zinc-200 transition-all flex items-center gap-2"
                        >
                            <Eye className="w-4 h-4" />
                            معاينة
                        </Link>
                        <button
                            onClick={togglePublish}
                            className={`px-6 py-3 rounded-2xl font-black transition-all border border-transparent flex items-center gap-2 ${
                                course.is_published
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                : 'bg-black text-white hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] hover:border-[#00D1FF]'
                            }`}
                        >
                            {course.is_published ? <CheckCircle2 className="w-4 h-4" /> : null}
                            {course.is_published ? 'منشورة (إلغاء النشر)' : 'نشر الدورة'}
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {course.chapters.map((chapter: any, index: number) => (
                        <div key={chapter.id} className="bg-white border border-zinc-100 rounded-[35px] overflow-hidden shadow-sm">
                            <div className="p-6 bg-zinc-50/50 flex items-center justify-between border-b border-zinc-100 flex-row-reverse">
                                <div className="flex items-center gap-4 flex-row-reverse">
                                    <GripVertical className="w-5 h-5 text-zinc-300 cursor-move" />
                                    <div className="flex items-center gap-3 flex-row-reverse">
                                        <span className="bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">الفصل {index + 1}</span>
                                        <h3 className="font-black text-lg">{chapter.title}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-row-reverse">
                                    <button className="p-2 hover:bg-white rounded-xl transition-colors text-zinc-400 hover:text-black border border-transparent hover:border-zinc-100"><Edit2 className="w-4 h-4" /></button>
                                    <button
                                        onClick={() => deleteChapter(chapter.id)}
                                        className="p-2 hover:bg-white rounded-xl transition-colors text-zinc-400 hover:text-red-500 border border-transparent hover:border-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronDown className="w-5 h-5 text-zinc-400 mr-2" />
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {chapter.lessons.map((lesson: any, lIndex: number) => (
                                    <div key={lesson.id} className="flex items-center justify-between p-5 bg-white border border-zinc-100 rounded-2xl group hover:border-[#00D1FF] transition-all flex-row-reverse">
                                        <div className="flex items-center gap-4 flex-row-reverse">
                                            <GripVertical className="w-4 h-4 text-zinc-200 cursor-move" />
                                            <div className="bg-zinc-50 p-3 rounded-xl group-hover:bg-[#00D1FF]/10 transition-colors">
                                                <Video className="w-5 h-5 text-zinc-400 group-hover:text-[#00D1FF]" />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black">{index + 1}.{lIndex + 1} {lesson.title}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">فيديو • {lesson.duration_minutes} دقيقة</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-row-reverse">
                                            <button className="p-2 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-400 hover:text-black"><Edit2 className="w-4 h-4" /></button>
                                            <button
                                                onClick={() => deleteLesson(lesson.id)}
                                                className="p-2 hover:bg-zinc-50 rounded-lg transition-colors text-zinc-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => {
                                        setActiveChapterId(chapter.id);
                                        setShowLessonModal(true);
                                    }}
                                    className="w-full py-5 border-2 border-dashed border-zinc-100 rounded-2xl text-sm font-black text-zinc-400 hover:border-[#00D1FF] hover:text-[#00D1FF] hover:bg-[#00D1FF]/5 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    إضافة درس جديد
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowChapterModal(true)}
                        className="w-full py-8 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-[35px] text-zinc-500 font-black hover:bg-white hover:border-[#00D1FF] hover:text-[#00D1FF] transition-all flex items-center justify-center gap-3"
                    >
                        <Plus className="w-7 h-7" />
                        إضافة فصل جديد للدورة
                    </button>
                </div>
            </div>

            {/* Add Chapter Modal */}
            {showChapterModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-right shadow-2xl border border-zinc-100 relative overflow-hidden font-['Cairo']" dir="rtl">
                        <div className="flex items-center justify-between mb-8 flex-row-reverse">
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="bg-black p-2 rounded-xl">
                                    <Layout className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="text-2xl font-black">إضافة فصل جديد</h2>
                            </div>
                            <button onClick={() => setShowChapterModal(false)} className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-zinc-400 hover:text-black">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddChapter} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black mb-2 text-zinc-700">عنوان الفصل</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={newChapterTitle}
                                    onChange={(e) => setNewChapterTitle(e.target.value)}
                                    placeholder="مثال: مقدمة في البرمجة"
                                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right font-bold"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-black text-white rounded-2xl font-black hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                                >
                                    إضافة الفصل
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowChapterModal(false)}
                                    className="px-8 py-4 bg-zinc-50 text-zinc-500 rounded-2xl font-black hover:bg-zinc-100 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Lesson Modal */}
            {showLessonModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-right shadow-2xl border border-zinc-100 relative overflow-hidden font-['Cairo']" dir="rtl">
                        <div className="flex items-center justify-between mb-8 flex-row-reverse">
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="bg-black p-2 rounded-xl">
                                    <Video className="w-5 h-5 text-[#00D1FF]" />
                                </div>
                                <h2 className="text-2xl font-black">إضافة درس جديد</h2>
                            </div>
                            <button onClick={() => setShowLessonModal(false)} className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-zinc-400 hover:text-black">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddLesson} className="space-y-6">
                            <div>
                                <label className="block text-sm font-black mb-2 text-zinc-700">عنوان الدرس</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    placeholder="مثال: إعداد بيئة العمل"
                                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-2 focus:ring-[#00D1FF] outline-none transition-all text-right font-bold"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-black text-white rounded-2xl font-black hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all border border-transparent hover:border-[#00D1FF]"
                                >
                                    إضافة الدرس
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLessonModal(false)}
                                    className="px-8 py-4 bg-zinc-50 text-zinc-500 rounded-2xl font-black hover:bg-zinc-100 transition-all"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
