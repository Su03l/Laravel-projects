'use client';

import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import FileGrid from '@/components/files/FileGrid';
import { FileItem, getTrashFiles, restoreFile } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export default function TrashPage() {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    const loadTrash = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getTrashFiles();
            setFiles(data);
        } catch (error) {
            console.error('Error loading trash:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTrash();
    }, [loadTrash]);

    const handleRestore = async (id: number) => {
        try {
            await restoreFile(id);
            showToast('File restored successfully', 'success');
            loadTrash();
        } catch (error) {
            console.error('Error restoring file:', error);
            showToast('Failed to restore file', 'error');
        }
    };

    return (
        <MainLayout>
            <div className="p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Trash Bin
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-500 mt-1">
                            Files you delete will appear here
                        </p>
                    </div>

                    {/* Info Badge */}
                    {!isLoading && files.length > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                            <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {files.length} file{files.length !== 1 ? 's' : ''} in trash
                            </span>
                        </div>
                    )}
                </div>

                {/* File Grid */}
                <FileGrid
                    files={files}
                    isLoading={isLoading}
                    onUpdate={loadTrash}
                    isTrash={true}
                    onRestore={handleRestore}
                />
            </div>
        </MainLayout>
    );
}
