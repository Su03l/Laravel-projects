'use client';

import { useState, useEffect } from 'react';
import { Note, NoteInput } from '@/types/note';
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/api';
import NoteCard from '@/components/NoteCard';
import NoteForm from '@/components/NoteForm';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      setError('فشل في تحميل الملاحظات. تأكد من تشغيل السيرفر.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: NoteInput) => {
    try {
      setIsSubmitting(true);
      const result = await createNote(data);
      setNotes([result.note, ...notes]);
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: NoteInput) => {
    if (!editingNote) return;
    try {
      setIsSubmitting(true);
      const result = await updateNote(editingNote.id, data);
      setNotes(notes.map(n => n.id === editingNote.id ? result.note : n));
      setEditingNote(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) return;
    try {
      await deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const openEditForm = (note: Note) => {
    setEditingNote(note);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-400/20 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl animate-pulse-slow" />

        <div className="relative mx-auto max-w-6xl px-6 py-16">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              ملاحظاتي
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              نظّم أفكارك واحتفظ بملاحظاتك في مكان واحد
            </p>
          </div>

          {/* Add Button */}
          <div className="mb-10 flex justify-center">
            <button
              onClick={() => setIsFormOpen(true)}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-4 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              ملاحظة جديدة
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 rounded-2xl bg-red-50 border border-red-200 p-6 text-center dark:bg-red-900/20 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchNotes}
                className="mt-3 text-sm font-medium text-red-600 underline hover:no-underline dark:text-red-400"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-white/50 dark:bg-zinc-800/50 animate-pulse"
                />
              ))}
            </div>
          ) : notes.length === 0 ? (
            /* Empty State */
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-700 dark:text-zinc-300">
                لا توجد ملاحظات
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                ابدأ بإضافة أول ملاحظة لك!
              </p>
            </div>
          ) : (
            /* Notes Grid */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NoteCard
                    note={note}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {(isFormOpen || editingNote) && (
        <NoteForm
          note={editingNote}
          onSubmit={editingNote ? handleUpdate : handleCreate}
          onClose={closeForm}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
