

import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

export interface FileItem {
    id: number;
    name: string;
    path: string;
    mime_type: string;
    size: number;
    url: string;
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ApiResponse<T> {
    message?: string;
    file?: T;
}


export const getFiles = async (): Promise<FileItem[]> => {
    const response = await apiClient.get<FileItem[]>('/files');
    return response.data;
};

/**
 * Upload a new file
 * @param file - File object to upload
 */
export const uploadFile = async (file: File): Promise<ApiResponse<FileItem>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<FileItem>>('/files', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

/**
 * Rename a file
 * @param id - File ID
 * @param name - New file name
 */
export const renameFile = async (id: number, name: string): Promise<ApiResponse<FileItem>> => {
    const response = await apiClient.put<ApiResponse<FileItem>>(`/files/${id}`, { name });
    return response.data;
};

/**
 * Delete a file (move to trash)
 * @param id - File ID
 */
export const deleteFile = async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/files/${id}`);
    return response.data;
};

// ===============================
// TRASH OPERATIONS
// ===============================

/**
 * Get all files in trash
 */
export const getTrashFiles = async (): Promise<FileItem[]> => {
    const response = await apiClient.get<FileItem[]>('/files/trash');
    return response.data;
};

/**
 * Restore a file from trash
 * @param id - File ID
 */
export const restoreFile = async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/files/${id}/restore`);
    return response.data;
};

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Format file size to human readable format
 * @param bytes - Size in bytes
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type category for icon display
 * @param mimeType - MIME type of the file
 */
export const getFileCategory = (mimeType: string): 'image' | 'pdf' | 'document' | 'other' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    return 'other';
};
