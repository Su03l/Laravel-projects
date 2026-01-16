'use client';

import { Contact } from '../types';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface ContactCardProps {
    contact: Contact;
    onView: (contact: Contact) => void;
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
}

export default function ContactCard({ contact, onView, onEdit, onDelete }: ContactCardProps) {
    // Get initials from name
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            dir="rtl"
            onClick={() => onView(contact)}
        >
            <div className="flex justify-center mb-6">
                {contact.photo_url ? (
                    <img
                        src={contact.photo_url}
                        alt={`${contact.first_name} ${contact.last_name}`}
                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 group-hover:border-black transition-colors duration-300"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                        {getInitials(contact.first_name, contact.last_name)}
                    </div>
                )}
            </div>

            <h3 className="text-xl font-bold text-center text-black mb-2">
                {contact.first_name} {contact.last_name}
            </h3>

            <p className="text-gray-600 text-center text-lg mb-2" dir="ltr">
                {contact.full_phone}
            </p>

            {contact.details && (
                <p className="text-gray-400 text-center text-sm mb-4 line-clamp-2">
                    {contact.details}
                </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => onView(contact)}
                    className="flex-1 bg-gray-50 text-gray-600 py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Eye className="w-5 h-5" />
                    عرض
                </button>
                <button
                    onClick={() => onEdit(contact)}
                    className="flex-1 bg-gray-100 text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Pencil className="w-5 h-5" />
                    تعديل
                </button>
                <button
                    onClick={() => onDelete(contact)}
                    className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-5 h-5" />
                    حذف
                </button>
            </div>
        </div>
    );
}
