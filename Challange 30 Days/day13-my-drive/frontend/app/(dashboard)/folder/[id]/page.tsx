'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { folderApi } from '@/lib/api';
import { Folder, FileItem, BreadcrumbItem, FolderContent } from '@/types';
import FileExplorer from '@/components/FileExplorer';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FolderPageProps {
    params: Promise<{ id: string }>;
}

export default function FolderPage({ params }: FolderPageProps) {
    const { id } = use(params);
    const folderId = parseInt(id, 10);
    const router = useRouter();

    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (isNaN(folderId)) {
            router.push('/dashboard');
            return;
        }

        setIsLoading(true);
        try {
            const data: FolderContent = await folderApi.getFolderContent(folderId);

            // Handle subfolders
            if (data.subfolders) {
                setFolders(Array.isArray(data.subfolders) ? data.subfolders : []);
            } else {
                setFolders([]);
            }

            // Handle files
            if (data.files) {
                setFiles(Array.isArray(data.files) ? data.files : []);
            } else {
                setFiles([]);
            }

            // Handle breadcrumbs
            if (data.breadcrumbs) {
                setBreadcrumbs(data.breadcrumbs);
            } else if (data.folder) {
                setBreadcrumbs([{ id: data.folder.id, name: data.folder.name }]);
            } else {
                setBreadcrumbs([]);
            }
        } catch (error) {
            console.error('Failed to fetch folder:', error);
            toast.error('فشل تحميل المجلد');
            router.push('/dashboard');
        } finally {
            setIsLoading(false);
        }
    }, [folderId, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <FileExplorer
            folders={folders}
            files={files}
            currentFolderId={folderId}
            breadcrumbs={breadcrumbs}
            isLoading={isLoading}
            onRefresh={fetchData}
        />
    );
}
