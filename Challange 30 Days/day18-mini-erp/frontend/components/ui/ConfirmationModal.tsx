'use client';

import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'حذف',
    cancelText = 'إلغاء',
    isLoading = false
}: ConfirmationModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="mt-2 text-right">
                <p className="text-sm text-gray-500">
                    {message}
                </p>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    {cancelText}
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600"
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? 'جاري الحذف...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
}
