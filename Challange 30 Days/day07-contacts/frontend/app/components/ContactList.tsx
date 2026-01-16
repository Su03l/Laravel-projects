'use client';

import { Contact } from '../types';
import ContactCard from './ContactCard';
import Spinner from './Spinner';
import { Users } from 'lucide-react';

interface ContactListProps {
    contacts: Contact[];
    loading: boolean;
    onView: (contact: Contact) => void;
    onEdit: (contact: Contact) => void;
    onDelete: (contact: Contact) => void;
}

export default function ContactList({ contacts, loading, onView, onEdit, onDelete }: ContactListProps) {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500" dir="rtl">
                <Users className="w-24 h-24 mb-4 stroke-1" />
                <h3 className="text-xl font-semibold text-gray-700">لا توجد جهات اتصال</h3>
                <p className="text-gray-400 mt-1">أضف أول جهة اتصال للبدء!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((contact) => (
                <ContactCard
                    key={contact.id}
                    contact={contact}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
