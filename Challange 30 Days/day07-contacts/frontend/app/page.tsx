'use client';

import { useState, useCallback } from 'react';
import { Contact, ContactFormData } from './types';
import { useContacts } from './hooks';
import {
  SearchBar,
  ContactList,
  ContactForm,
  Pagination,
  DeleteModal,
  ViewContactModal,
  ToastContainer,
} from './components';
import { Phone, UserPlus } from 'lucide-react';

export default function Home() {
  const {
    contacts,
    loading,
    currentPage,
    lastPage,
    toasts,
    removeToast,
    handleSearch,
    handlePageChange,
    handleCreate,
    handleUpdate,
    handleDelete,
  } = useContacts();

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // View modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Open view modal
  const handleViewClick = useCallback((contact: Contact) => {
    setViewingContact(contact);
    setViewModalOpen(true);
  }, []);

  // Open form for editing
  const handleEditClick = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  }, []);

  // Open delete confirmation
  const handleDeleteClick = useCallback((contact: Contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  }, []);

  // Confirm delete
  const confirmDelete = useCallback(async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      await handleDelete(contactToDelete.id);
      setDeleteModalOpen(false);
      setContactToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }, [contactToDelete, handleDelete]);

  // Handle form submit
  const handleFormSubmit = useCallback(async (data: ContactFormData) => {
    if (editingContact) {
      await handleUpdate(editingContact.id, data);
    } else {
      await handleCreate(data);
    }
  }, [editingContact, handleCreate, handleUpdate]);

  // Close form
  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingContact(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-black">دليل الهاتف الذكي</h1>
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                setEditingContact(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5" />
              إضافة جهة اتصال
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContactList
          contacts={contacts}
          loading={loading}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Footer with Pagination */}
      {!loading && contacts.length > 0 && (
        <footer className="bg-white border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        </footer>
      )}

      {/* View Contact Modal */}
      <ViewContactModal
        isOpen={viewModalOpen}
        contact={viewingContact}
        onClose={() => {
          setViewModalOpen(false);
          setViewingContact(null);
        }}
        onEdit={handleEditClick}
      />

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        editingContact={editingContact}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        contact={contactToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setContactToDelete(null);
        }}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
