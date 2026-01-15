'use client';

import { FileItem } from '@/lib/api';
import FileCard from './FileCard';

interface FileGridProps {
    files: FileItem[];
    isLoading: boolean;
    onUpdate: () => void;
    isTrash?: boolean;
    onRestore?: (id: number) => void;
}

export default function FileGrid({ files, isLoading, onUpdate, isTrash = false, onRestore }: FileGridProps) {
    // Loading skeleton
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-neutral-200 dark:bg-neutral-800 rounded-2xl overflow-hidden">
                            <div className="h-40 bg-neutral-300 dark:bg-neutral-700" />
                            <div className="p-4">
                                <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty state
    if (files.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                    {isTrash ? (
                        <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : (
                        <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    )}
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                    {isTrash ? 'Trash is empty' : 'No files yet'}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                    {isTrash
                        ? 'Files you delete will appear here'
                        : 'Upload your first file to get started'
                    }
                </p>
            </div>
        );
    }

    // File grid
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
                <FileCard
                    key={file.id}
                    file={file}
                    onUpdate={onUpdate}
                    isTrash={isTrash}
                    onRestore={onRestore}
                />
            ))}
        </div>
    );
}
