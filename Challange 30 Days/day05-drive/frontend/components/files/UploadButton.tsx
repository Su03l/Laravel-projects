'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface UploadButtonProps {
    onUploadSuccess: () => void;
}

export default function UploadButton({ onUploadSuccess }: UploadButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { showToast } = useToast();

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB as per backend)
        if (file.size > 2 * 1024 * 1024) {
            showToast('File size must be less than 2MB', 'error');
            return;
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Only JPG, PNG, PDF, and DOCX files are allowed', 'error');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + 10;
            });
        }, 200);

        try {
            await uploadFile(file);
            setUploadProgress(100);
            showToast('File uploaded successfully', 'success');
            onUploadSuccess();
        } catch (error) {
            console.error('Error uploading file:', error);
            showToast('Failed to upload file', 'error');
        } finally {
            clearInterval(progressInterval);
            setIsUploading(false);
            setUploadProgress(0);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.docx"
                className="hidden"
            />

            <button
                onClick={handleClick}
                disabled={isUploading}
                className="relative inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
            >
                {/* Progress bar */}
                {isUploading && (
                    <div
                        className="absolute inset-0 bg-neutral-600 dark:bg-neutral-300 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                    />
                )}

                <span className="relative flex items-center gap-3">
                    {isUploading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Uploading... {uploadProgress}%</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Upload New File</span>
                        </>
                    )}
                </span>
            </button>
        </>
    );
}
