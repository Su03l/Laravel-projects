'use client';

import { useState } from 'react';
import Modal from './Modal';
import { renameFile } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface RenameModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileId: number;
    currentName: string;
    onRenameSuccess: () => void;
}

export default function RenameModal({
    isOpen,
    onClose,
    fileId,
    currentName,
    onRenameSuccess
}: RenameModalProps) {
    const [newName, setNewName] = useState(currentName);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newName.trim()) {
            showToast('Please enter a file name', 'error');
            return;
        }

        setIsLoading(true);
        try {
            await renameFile(fileId, newName.trim());
            showToast('File renamed successfully', 'success');
            onRenameSuccess();
            onClose();
        } catch (error) {
            console.error('Error renaming file:', error);
            showToast('Failed to rename file', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Rename File">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label
                        htmlFor="fileName"
                        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                    >
                        File Name
                    </label>
                    <input
                        type="text"
                        id="fileName"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                        placeholder="Enter new file name"
                        autoFocus
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            'Save'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
