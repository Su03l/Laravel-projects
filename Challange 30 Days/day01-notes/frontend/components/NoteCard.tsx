'use client';

import { Note } from '@/types/note';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/80 to-white/40 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] dark:from-zinc-800/80 dark:to-zinc-900/40 border border-white/20 dark:border-zinc-700/50">
            {/* Gradient accent */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />

            {/* Content */}
            <div className="space-y-3">
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 line-clamp-2">
                    {note.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {note.content}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDate(note.created_at)}
                </p>
            </div>

            {/* Actions */}
            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                    onClick={() => onEdit(note)}
                    className="rounded-full bg-violet-500/10 p-2 text-violet-600 transition-colors hover:bg-violet-500 hover:text-white dark:text-violet-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
                <button
                    onClick={() => onDelete(note.id)}
                    className="rounded-full bg-red-500/10 p-2 text-red-600 transition-colors hover:bg-red-500 hover:text-white dark:text-red-400"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
