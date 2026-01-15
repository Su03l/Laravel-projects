'use client';

import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import FileGrid from '@/components/files/FileGrid';
import UploadButton from '@/components/files/UploadButton';
import { FileItem, getFiles } from '@/lib/api';

export default function MyFilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
              My Files
            </h1>
            <p className="text-neutral-500 dark:text-neutral-500 mt-1">
              Manage and organize your uploaded files
            </p>
          </div>
          <UploadButton onUploadSuccess={loadFiles} />
        </div>

        {/* Stats Bar */}
        {!isLoading && files.length > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500">Total Files</p>
                  <p className="text-lg font-semibold text-neutral-900 dark:text-white">{files.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* File Grid */}
        <FileGrid
          files={files}
          isLoading={isLoading}
          onUpdate={loadFiles}
        />
      </div>
    </MainLayout>
  );
}
