'use client';

import { Contact } from '../types';
import { X, Phone, Mail, FileText, Calendar } from 'lucide-react';

interface ViewContactModalProps {
    isOpen: boolean;
    contact: Contact | null;
    onClose: () => void;
    onEdit: (contact: Contact) => void;
}

export default function ViewContactModal({ isOpen, contact, onClose, onEdit }: ViewContactModalProps) {
    if (!isOpen || !contact) return null;

    // Get initials from name
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" dir="rtl">
                {/* Header with close button */}
                <div className="absolute top-4 left-4 z-10">
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/80 hover:bg-white rounded-full transition-colors shadow-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Hero Section with Avatar */}
                <div className="bg-gradient-to-b from-gray-100 to-white pt-8 pb-6 px-6">
                    <div className="flex flex-col items-center">
                        {/* Avatar */}
                        {contact.photo_url ? (
                            <img
                                src={contact.photo_url}
                                alt={`${contact.first_name} ${contact.last_name}`}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold shadow-xl">
                                {getInitials(contact.first_name, contact.last_name)}
                            </div>
                        )}

                        {/* Name */}
                        <h2 className="text-2xl font-bold text-black mt-4">
                            {contact.first_name} {contact.last_name}
                        </h2>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="p-6 space-y-4">
                    {/* Phone */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500">رقم الهاتف</p>
                            <p className="text-lg font-semibold text-black" dir="ltr">{contact.full_phone}</p>
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(contact.full_phone.replace(/\s/g, ''));
                            }}
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            نسخ
                        </button>
                    </div>

                    {/* Email - if exists */}
                    {contact.email && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Mail className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                                <p className="text-lg font-semibold text-black">{contact.email}</p>
                            </div>
                        </div>
                    )}

                    {/* Details/Notes - if exists */}
                    {contact.details && (
                        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">ملاحظات</p>
                                <p className="text-gray-700 mt-1">{contact.details}</p>
                            </div>
                        </div>
                    )}

                    {/* Created date */}
                    {contact.created_at && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-500">تاريخ الإضافة</p>
                                <p className="text-gray-700">{formatDate(contact.created_at)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0">
                    <button
                        onClick={() => {
                            onClose();
                            onEdit(contact);
                        }}
                        className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        تعديل جهة الاتصال
                    </button>
                </div>
            </div>
        </div>
    );
}
