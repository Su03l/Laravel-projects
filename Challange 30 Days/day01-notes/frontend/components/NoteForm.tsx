'use client';

import { useState, useEffect } from 'react';
import { Note, NoteInput } from '@/types/note';

interface NoteFormProps {
    note?: Note | null;
    onSubmit: (data: NoteInput) => void;
    onClose: () => void;
    isLoading?: boolean;
}

export default function NoteForm({ note, onSubmit, onClose, isLoading }: NoteFormProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        }
    }, [note]);

    const validate = (): boolean => {
        const newErrors: { title?: string; content?: string } = {};

        if (!title.trim()) {
            newErrors.title = 'العنوان مطلوب';
        } else if (title.length < 3) {
            newErrors.title = 'العنوان يجب أن يكون 3 أحرف على الأقل';
        }

        if (!content.trim()) {
            newErrors.content = 'المحتوى مطلوب';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({ title: title.trim(), content: content.trim() });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
                <div className="rounded-3xl bg-white p-8 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                            {note ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Title */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                العنوان
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="أدخل عنوان الملاحظة..."
                                className={`w-full rounded-xl border-2 bg-zinc-50 px-4 py-3 text-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:bg-zinc-800 dark:text-zinc-100 ${errors.title
                                        ? 'border-red-400 focus:border-red-500'
                                        : 'border-zinc-200 focus:border-violet-500 dark:border-zinc-700'
                                    }`}
                                dir="rtl"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                المحتوى
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="اكتب محتوى الملاحظة هنا..."
                                rows={5}
                                className={`w-full resize-none rounded-xl border-2 bg-zinc-50 px-4 py-3 text-zinc-800 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:bg-zinc-800 dark:text-zinc-100 ${errors.content
                                        ? 'border-red-400 focus:border-red-500'
                                        : 'border-zinc-200 focus:border-violet-500 dark:border-zinc-700'
                                    }`}
                                dir="rtl"
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        جاري الحفظ...
                                    </span>
                                ) : (
                                    note ? 'حفظ التعديلات' : 'إضافة الملاحظة'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-xl border-2 border-zinc-200 px-6 py-3 font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
