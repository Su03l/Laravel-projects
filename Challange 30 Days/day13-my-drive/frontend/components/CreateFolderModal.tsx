'use client';

import { useState } from 'react';
import { X, FolderPlus, Loader2 } from 'lucide-react';
import { folderApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
    parentId?: number | null;
    onSuccess: () => void;
}

export default function CreateFolderModal({ isOpen, onClose, parentId, onSuccess }: CreateFolderModalProps) {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { toast.error('Please enter a folder name'); return; }
        setIsLoading(true);
        try {
            await folderApi.createFolder(name.trim(), parentId);
            toast.success('تم إنشاء المجلد بنجاح');
            setName('');
            onSuccess();
            onClose();
        } catch { toast.error('فشل إنشاء المجلد'); }
        finally { setIsLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                            <FolderPlus className="w-5 h-5" style={{ color: '#fbbf24' }} />
                        </div>
                        <h2 className="text-lg font-semibold text-white">New Folder</h2>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                        <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Folder Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter folder name..."
                            className="input"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" disabled={isLoading || !name.trim()} className="btn btn-primary">
                            {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />Creating...</>) : 'Create Folder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
