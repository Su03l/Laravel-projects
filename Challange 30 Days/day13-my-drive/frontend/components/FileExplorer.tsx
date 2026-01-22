'use client';

import { useState } from 'react';
import { Folder as FolderType, FileItem, BreadcrumbItem } from '@/types';
import { folderApi, fileApi } from '@/lib/api';
import toast from 'react-hot-toast';
import Breadcrumbs from './Breadcrumbs';
import FolderCard from './FolderCard';
import FileCard from './FileCard';
import NewButton from './NewButton';
import CreateFolderModal from './CreateFolderModal';
import UploadFileModal from './UploadFileModal';
import { FolderOpen, Loader2 } from 'lucide-react';

interface FileExplorerProps {
    folders: FolderType[];
    files: FileItem[];
    currentFolderId: number | null;
    breadcrumbs: BreadcrumbItem[];
    isLoading: boolean;
    onRefresh: () => void;
}

export default function FileExplorer({ folders, files, currentFolderId, breadcrumbs, isLoading, onRefresh }: FileExplorerProps) {
    const [showCreateFolder, setShowCreateFolder] = useState(false);
    const [showUploadFile, setShowUploadFile] = useState(false);

    const handleDeleteFolder = async (id: number) => {
        if (!confirm('Are you sure you want to delete this folder?')) return;
        try { await folderApi.deleteFolder(id); toast.success('تم حذف المجلد'); onRefresh(); }
        catch { toast.error('فشل حذف المجلد'); }
    };

    const handleDeleteFile = async (id: number) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try { await fileApi.deleteFile(id); toast.success('تم حذف الملف'); onRefresh(); }
        catch { toast.error('فشل حذف الملف'); }
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-6">
                <Breadcrumbs items={breadcrumbs} />
                <NewButton onNewFolder={() => setShowCreateFolder(true)} onUploadFile={() => setShowUploadFile(true)} />
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
            ) : folders.length === 0 && files.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="p-4 rounded-full mb-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <FolderOpen className="w-12 h-12" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">This folder is empty</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Create a folder or upload files to get started</p>
                </div>
            ) : (
                <>
                    {folders.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Folders</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {folders.map((folder) => <FolderCard key={folder.id} folder={folder} onDelete={handleDeleteFolder} />)}
                            </div>
                        </div>
                    )}
                    {files.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium mb-4 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Files</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {files.map((file) => <FileCard key={file.id} file={file} onDelete={handleDeleteFile} />)}
                            </div>
                        </div>
                    )}
                </>
            )}

            <CreateFolderModal isOpen={showCreateFolder} onClose={() => setShowCreateFolder(false)} parentId={currentFolderId} onSuccess={onRefresh} />
            <UploadFileModal isOpen={showUploadFile} onClose={() => setShowUploadFile(false)} folderId={currentFolderId} onSuccess={onRefresh} />
        </div>
    );
}
