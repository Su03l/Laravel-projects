'use client';

import { Contact } from '../types';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    contact: Contact | null;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

export default function DeleteModal({ isOpen, contact, onConfirm, onCancel, isDeleting }: DeleteModalProps) {
    if (!isOpen || !contact) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6" dir="rtl">
                {/* Warning Icon */}
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-black" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-center text-black mb-2">
                    حذف جهة الاتصال؟
                </h3>

                {/* Message */}
                <p className="text-center text-gray-600 mb-6">
                    هل أنت متأكد من حذف <span className="font-semibold">{contact.first_name} {contact.last_name}</span>؟ لا يمكن التراجع عن هذا الإجراء.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري الحذف...
                            </>
                        ) : (
                            'حذف'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
