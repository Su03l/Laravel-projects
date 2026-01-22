'use client';

import { useState, useRef, useEffect } from 'react';
import { FileText, Image as ImageIcon, FileCode, File, Download, MoreVertical, Trash2, Loader2 } from 'lucide-react';
import { FileItem as FileType } from '@/types';
import { fileApi, triggerDownload } from '@/lib/api';
import toast from 'react-hot-toast';

interface FileCardProps {
    file: FileType;
    onDelete: (id: number) => void;
    onPreview: (file: FileType) => void;
}

function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) {
        return { icon: ImageIcon, color: '#a3e635', bg: 'rgba(163, 230, 53, 0.1)' };
    }
    if (mimeType === 'application/pdf') {
        return { icon: FileText, color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)' };
    }
    if (mimeType.includes('javascript') || mimeType.includes('json') || mimeType.includes('html') || mimeType.includes('css')) {
        return { icon: FileCode, color: '#fff', bg: 'rgba(255, 255, 255, 0.1)' };
    }
    return { icon: File, color: '#a1a1a1', bg: 'var(--card-hover)' };
}

export default function FileCard({ file, onDelete, onPreview }: FileCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isImage = file.mime_type.startsWith('image/');
    const { icon: Icon, color, bg } = getFileIcon(file.mime_type);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const imageUrl = isImage ? `${backendUrl}/storage/${file.path}` : null;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownload = async (e?: React.MouseEvent) => {
        e?.stopPropagation();
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

    const handleCardClick = () => {
        onPreview(file);
    };

    return (
        <div
            className="card card-interactive group relative p-4 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex flex-col items-center gap-3">
                {/* Image Preview or Icon */}
                {isImage && imageUrl ? (
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-black/20">
                        <img
                            src={imageUrl}
                            alt={file.original_name || file.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="p-4 rounded-xl" style={{ backgroundColor: bg }}>
                        <Icon className="w-12 h-12" style={{ color }} />
                    </div>
                )}

                <div className="w-full text-center">
                    <p className="text-sm font-medium text-white truncate px-2" title={file.original_name || file.name}>
                        {file.original_name || file.name}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                        {formatSize(file.size)}
                    </p>
                </div>
            </div>

            <button
                onClick={(e) => handleDownload(e)}
                disabled={isDownloading}
                className="absolute bottom-2 left-2 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 disabled:opacity-50"
                title="Download"
            >
                {isDownloading ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                    <Download className="w-4 h-4 text-white" />
                )}
            </button>

            <div className="absolute top-2 right-2" ref={menuRef}>
                <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
                >
                    <MoreVertical className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                </button>

                {showMenu && (
                    <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { handleDownload(); setShowMenu(false); }} className="dropdown-item">
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                        <button onClick={() => { onDelete(file.id); setShowMenu(false); }} className="dropdown-item danger">
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
