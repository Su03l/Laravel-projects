'use client';

import { useState, useCallback, useEffect } from 'react';
import { Contact, ContactFormData, PaginatedResponse } from '../types';
import { getContacts, createContact, updateContact, deleteContact } from '../lib/api';
import { ToastType } from '../components/Toast';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

export function useContacts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Add toast notification
    const addToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    // Remove toast
    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Fetch contacts
    const fetchContacts = useCallback(async (page: number = 1, search: string = '') => {
        setLoading(true);
        try {
            const response: PaginatedResponse = await getContacts(page, search);
            setContacts(response.data);
            setCurrentPage(response.current_page);
            setLastPage(response.last_page);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
            addToast('فشل في تحميل جهات الاتصال', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    // Initial load
    useEffect(() => {
        fetchContacts(1, '');
    }, []);

    // Search handler
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
        fetchContacts(1, query);
    }, [fetchContacts]);

    // Page change handler
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        fetchContacts(page, searchQuery);
    }, [fetchContacts, searchQuery]);

    // Create contact
    const handleCreate = useCallback(async (data: ContactFormData) => {
        try {
            await createContact(data);
            addToast('تم إضافة جهة الاتصال بنجاح!', 'success');
            fetchContacts(currentPage, searchQuery);
        } catch (error) {
            console.error('Failed to create contact:', error);
            addToast('فشل في إضافة جهة الاتصال', 'error');
            throw error;
        }
    }, [addToast, fetchContacts, currentPage, searchQuery]);

    // Update contact
    const handleUpdate = useCallback(async (id: number, data: ContactFormData) => {
        try {
            await updateContact(id, data);
            addToast('تم تحديث جهة الاتصال بنجاح!', 'success');
            fetchContacts(currentPage, searchQuery);
        } catch (error) {
            console.error('Failed to update contact:', error);
            addToast('فشل في تحديث جهة الاتصال', 'error');
            throw error;
        }
    }, [addToast, fetchContacts, currentPage, searchQuery]);

    // Delete contact
    const handleDelete = useCallback(async (id: number) => {
        try {
            await deleteContact(id);
            addToast('تم حذف جهة الاتصال بنجاح!', 'success');
            fetchContacts(currentPage, searchQuery);
        } catch (error) {
            console.error('Failed to delete contact:', error);
            addToast('فشل في حذف جهة الاتصال', 'error');
            throw error;
        }
    }, [addToast, fetchContacts, currentPage, searchQuery]);

    return {
        contacts,
        loading,
        currentPage,
        lastPage,
        toasts,
        addToast,
        removeToast,
        handleSearch,
        handlePageChange,
        handleCreate,
        handleUpdate,
        handleDelete,
        refreshContacts: () => fetchContacts(currentPage, searchQuery),
    };
}
