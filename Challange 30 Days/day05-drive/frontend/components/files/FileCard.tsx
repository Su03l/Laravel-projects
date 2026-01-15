'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FileItem, formatFileSize, getFileCategory, deleteFile } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import RenameModal from '@/components/ui/RenameModal';

interface FileCardProps {
    file: FileItem;
    onUpdate: () => void;
    isTrash?: boolean;
    onRestore?: (id: number) => void;
}

export default function FileCard({ file, onUpdate, isTrash = false, onRestore }: FileCardProps) {
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { showToast } = useToast();

    const fileCategory = getFileCategory(file.mime_type);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteFile(file.id);
            showToast('File moved to trash', 'success');
            onUpdate();
        } catch (error) {
            console.error('Error deleting file:', error);
            showToast('Failed to delete file', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRestore = () => {
        if (onRestore) {
            onRestore(file.id);
        }
    };

    // Render file preview/icon
    const renderPreview = () => {
        if (fileCategory === 'image') {
            return (
                <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            );
        }

        // PDF Icon
        if (fileCategory === 'pdf') {
            return (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-bold text-red-600 dark:text-red-400 mt-2 block">PDF</span>
                    </div>
                </div>
            );
        }

        // Document Icon
        if (fileCategory === 'document') {
            return (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <div className="text-center">
                        <svg className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 block">DOC</span>
                    </div>
                </div>
            );
        }

        // Generic File Icon
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
                <svg className="w-12 h-12 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            </div>
        );
    };

    return (
        <>
            <div className={`
        group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800
        shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1
        ${isTrash ? 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0' : ''}
      `}>
                {/* Preview Area */}
                <div className="relative h-40 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    {renderPreview()}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3 flex justify-end gap-2">
                            {!isTrash ? (
                                <>
                                    {/* Rename Button */}
                                    <button
                                        onClick={() => setIsRenameModalOpen(true)}
                                        className="p-2 rounded-lg bg-white/90 dark:bg-black/90 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-black transition-colors shadow-lg"
                                        title="Rename"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="p-2 rounded-lg bg-white/90 dark:bg-black/90 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors shadow-lg disabled:opacity-50"
                                        title="Delete"
                                    >
                                        {isDeleting ? (
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </>
                            ) : (
                                /* Restore Button */
                                <button
                                    onClick={handleRestore}
                                    className="p-2 rounded-lg bg-white/90 dark:bg-black/90 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 transition-colors shadow-lg"
                                    title="Restore"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* File Info */}
                <div className="p-4">
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white truncate" title={file.name}>
                        {file.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                        {formatFileSize(file.size)}
                    </p>
                </div>
            </div>

            {/* Rename Modal */}
            <RenameModal
                isOpen={isRenameModalOpen}
                onClose={() => setIsRenameModalOpen(false)}
                fileId={file.id}
                currentName={file.name}
                onRenameSuccess={onUpdate}
            />
        </>
    );
}
