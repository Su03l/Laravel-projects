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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select a file');
            return;
        }

        setIsLoading(true);
        try {
            await fileApi.uploadFile(file, folderId);
            toast.success('تم رفع الملف بنجاح');
            setFile(null);
            onSuccess();
            onClose();
        } catch {
            toast.error('فشل رفع الملف');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[var(--primary-light)] rounded-lg">
                            <Upload className="w-5 h-5 text-[var(--primary)]" />
                        </div>
                        <h2 className="text-lg font-semibold text-[var(--foreground)]">
                            Upload File
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-md hover:bg-[var(--background-tertiary)] transition-colors"
                    >
                        <X className="w-5 h-5 text-[var(--foreground-secondary)]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => inputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                                    : file
                                        ? 'border-[var(--success)] bg-[var(--success)]/5'
                                        : 'border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--background-tertiary)]'
                                }`}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <FileUp className="w-12 h-12 text-[var(--success)]" />
                                    <p className="text-sm font-medium text-[var(--foreground)]">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-[var(--foreground-secondary)]">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <Upload className="w-12 h-12 text-[var(--foreground-secondary)]" />
                                    <p className="text-sm font-medium text-[var(--foreground)]">
                                        Drag & drop a file here
                                    </p>
                                    <p className="text-xs text-[var(--foreground-secondary)]">
                                        or click to browse
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !file}
                            className="btn btn-primary"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                'Upload File'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
