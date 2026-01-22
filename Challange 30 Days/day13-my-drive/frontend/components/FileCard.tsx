'use client';

import { useState, useRef, useEffect } from 'react';
import {
    FileText,
    Image,
    FileCode,
    File,
    Download,
    MoreVertical,
    Trash2,
    Loader2
} from 'lucide-react';
import { FileItem as FileType } from '@/types';
import { fileApi, triggerDownload } from '@/lib/api';
import toast from 'react-hot-toast';

interface FileCardProps {
    file: FileType;
    onDelete: (id: number) => void;
}

// Format file size
function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Get file icon based on mime type
function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) {
        return { icon: Image, color: 'text-[var(--success)]', bg: 'bg-[var(--success)]/10' };
    }
    if (mimeType === 'application/pdf') {
        return { icon: FileText, color: 'text-[var(--danger)]', bg: 'bg-[var(--danger)]/10' };
    }
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html') || mimeType.includes('css')) {
        return { icon: FileCode, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary-light)]' };
    }
    return { icon: File, color: 'text-[var(--foreground-secondary)]', bg: 'bg-[var(--background-tertiary)]' };
}

export default function FileCard({ file, onDelete }: FileCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { icon: Icon, color, bg } = getFileIcon(file.mime_type);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    return (
        <div className="card group relative p-4">
            <div className="flex flex-col items-center gap-3">
                <div className={`p-4 ${bg} rounded-xl`}>
                    <Icon className={`w-12 h-12 ${color}`} />
                </div>
                <div className="w-full text-center">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate px-2" title={file.original_name || file.name}>
                        {file.original_name || file.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                        {formatSize(file.size)}
                    </p>
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="absolute bottom-2 left-2 p-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[var(--primary-light)] text-[var(--primary)] transition-all disabled:opacity-50"
                title="Download"
            >
                {isDownloading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
            </button>

            {/* Menu Button */}
            <div className="absolute top-2 right-2" ref={menuRef}>
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[var(--background-tertiary)] transition-all"
                >
                    <MoreVertical className="w-4 h-4 text-[var(--foreground-secondary)]" />
                </button>

                {showMenu && (
                    <div className="dropdown-menu">
                        <button
                            onClick={() => {
                                handleDownload();
                                setShowMenu(false);
                            }}
                            className="dropdown-item"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button
                            onClick={() => {
                                onDelete(file.id);
                                setShowMenu(false);
                            }}
                            className="dropdown-item danger"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
