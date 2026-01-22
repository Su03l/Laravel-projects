'use client';

import { useState } from 'react';
import { X, Download, Trash2, Loader2, FileText, FileCode, File, Calendar, HardDrive, FolderOpen } from 'lucide-react';
import { FileItem } from '@/types';
import { fileApi, triggerDownload } from '@/lib/api';
import toast from 'react-hot-toast';

interface FilePreviewModalProps {
    file: FileItem | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (id: number) => void;
}

function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getFileIcon(mimeType: string) {
    if (mimeType === 'application/pdf') {
        return { icon: FileText, color: '#f87171' };
    }
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html') || mimeType.includes('css')) {
        return { icon: FileCode, color: '#fff' };
    }
    return { icon: File, color: '#a1a1a1' };
}

export default function FilePreviewModal({ file, isOpen, onClose, onDelete }: FilePreviewModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !file) return null;

    const isImage = file.mime_type.startsWith('image/');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const imageUrl = isImage ? `${backendUrl}/storage/${file.path}` : null;
    const { icon: Icon, color } = getFileIcon(file.mime_type);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const blob = await fileApi.downloadFile(file.id);
            triggerDownload(blob, file.original_name || file.name);
            toast.success('تم تحميل الملف');
        } catch {
            toast.error('فشل تحميل الملف');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

        setIsDeleting(true);
        try {
            onDelete(file.id);
            onClose();
        } catch {
            toast.error('فشل حذف الملف');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '90vh', overflow: 'auto' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white truncate pr-4">
                        {file.original_name || file.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5" style={{ color: 'var(--muted)' }} />
                    </button>
                </div>

                {/* Image Preview - Full Width on Top */}
                <div className="flex items-center justify-center bg-black/30 rounded-xl p-4 mb-6" style={{ minHeight: '280px' }}>
                    {isImage && imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={file.original_name || file.name}
                            className="max-w-full max-h-80 object-contain rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <Icon className="w-20 h-20" style={{ color }} />
                            </div>
                            <p className="text-sm" style={{ color: 'var(--muted)' }}>
                                لا يمكن معاينة هذا الملف
                            </p>
                        </div>
                    )}
                </div>

                {/* Details Section - Grid Layout Below */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* File Name */}
                    <div className="flex items-center gap-3 p-3 rounded-lg col-span-2" style={{ backgroundColor: 'var(--card-hover)' }}>
                        <File className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>اسم الملف</p>
                            <p className="text-sm text-white truncate">{file.original_name || file.name}</p>
                        </div>
                    </div>

                    {/* File Size */}
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card-hover)' }}>
                        <HardDrive className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                        <div>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>الحجم</p>
                            <p className="text-sm text-white">{formatSize(file.size)}</p>
                        </div>
                    </div>

                    {/* File Type */}
                    <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card-hover)' }}>
                        <FolderOpen className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                        <div className="min-w-0">
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>نوع الملف</p>
                            <p className="text-sm text-white truncate">{file.mime_type}</p>
                        </div>
                    </div>

                    {/* Created At */}
                    <div className="flex items-center gap-3 p-3 rounded-lg col-span-2" style={{ backgroundColor: 'var(--card-hover)' }}>
                        <Calendar className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                        <div>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>تاريخ الرفع</p>
                            <p className="text-sm text-white">{formatDate(file.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Actions - Bottom */}
                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="btn btn-primary flex-1"
                    >
                        {isDownloading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...</>
                        ) : (
                            <><Download className="w-4 h-4" /> تحميل</>
                        )}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="btn btn-danger flex-1"
                    >
                        {isDeleting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحذف...</>
                        ) : (
                            <><Trash2 className="w-4 h-4" /> حذف</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
