'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileUp, Loader2 } from 'lucide-react';
import { fileApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface UploadFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    folderId?: number | null;
    onSuccess: () => void;
}

export default function UploadFileModal({ isOpen, onClose, folderId, onSuccess }: UploadFileModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) { toast.error('Please select a file'); return; }
        setIsLoading(true);
        try {
            await fileApi.uploadFile(file, folderId);
            toast.success('تم رفع الملف بنجاح');
            setFile(null);
            onSuccess();
            onClose();
        } catch { toast.error('فشل رفع الملف'); }
        finally { setIsLoading(false); }
    };

    const handleClose = () => { setFile(null); onClose(); };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Upload File</h2>
                    </div>
                    <button onClick={handleClose} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onClick={() => inputRef.current?.click()}
                            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                            style={{
                                borderColor: isDragging ? '#fff' : file ? '#a3e635' : 'var(--border-color)',
                                backgroundColor: isDragging ? 'rgba(255,255,255,0.1)' : file ? 'rgba(163,230,53,0.05)' : 'transparent',
                            }}
                        >
                            <input ref={inputRef} type="file" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} className="hidden" />

                            {file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileUp className="w-12 h-12" style={{ color: '#a3e635' }} />
                                    <p className="text-sm font-medium text-white">{file.name}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
                                    <p className="text-sm font-medium text-white">Drag & drop a file here</p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>or click to browse</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={isLoading || !file} className="btn btn-primary">
                            {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Uploading...</>) : 'Upload File'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
