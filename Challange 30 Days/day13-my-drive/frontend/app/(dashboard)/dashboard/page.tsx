'use client';

import { useState, useEffect, useCallback } from 'react';
import { folderApi, fileApi } from '@/lib/api';
import { Folder, FileItem } from '@/types';
import FileExplorer from '@/components/FileExplorer';

export default function DashboardPage() {
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [foldersData, filesData] = await Promise.all([
                folderApi.getRootFolders(),
                fileApi.getRootFiles(),
            ]);
            setFolders(Array.isArray(foldersData) ? foldersData : []);
            setFiles(Array.isArray(filesData) ? filesData : []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setFolders([]);
            setFiles([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <FileExplorer
            folders={folders}
            files={files}
            currentFolderId={null}
            breadcrumbs={[]}
            isLoading={isLoading}
            onRefresh={fetchData}
        />
    );
}
