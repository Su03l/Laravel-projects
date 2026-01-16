'use client';

import { useState, useEffect, useRef } from 'react';
import { Contact, ContactFormData, COUNTRY_CODES } from '../types';
import Spinner from './Spinner';
import { X, Plus, ImagePlus } from 'lucide-react';

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ContactFormData) => Promise<void>;
    editingContact: Contact | null;
}

export default function ContactForm({ isOpen, onClose, onSubmit, editingContact }: ContactFormProps) {
    const [formData, setFormData] = useState<ContactFormData>({
        first_name: '',
        last_name: '',
        country_code: '+966',
        phone: '',
        details: '',
        photo: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset form when modal opens/closes or editing contact changes
    useEffect(() => {
        if (isOpen) {
            if (editingContact) {
                // Parse country code and phone from full_phone
                const fullPhone = editingContact.full_phone || '';
                let countryCode = '+966';
                let phone = fullPhone;

                // Try to extract country code
                for (const cc of COUNTRY_CODES) {
                    if (fullPhone.startsWith(cc.code)) {
                        countryCode = cc.code;
                        phone = fullPhone.substring(cc.code.length).trim();
                        break;
                    }
                }

                setFormData({
                    first_name: editingContact.first_name,
                    last_name: editingContact.last_name,
                    country_code: countryCode,
                    phone: phone,
                    details: editingContact.details || '',
                    photo: null,
                });
                setImagePreview(editingContact.photo_url);
            } else {
                setFormData({
                    first_name: '',
                    last_name: '',
                    country_code: '+966',
                    phone: '',
                    details: '',
                    photo: null,
                });
                setImagePreview(null);
            }
        }
    }, [isOpen, editingContact]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto" dir="rtl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-black">
                        {editingContact ? 'تعديل جهة الاتصال' : 'إضافة جهة اتصال جديدة'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-black transition-colors overflow-hidden"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-gray-400">
                                    <ImagePlus className="w-8 h-8" />
                                    <span className="text-xs mt-1">إضافة صورة</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {imagePreview && (
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setFormData({ ...formData, photo: null });
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="mt-2 text-sm text-gray-500 hover:text-black"
                            >
                                إزالة الصورة
                            </button>
                        )}
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            الاسم الأول *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.first_name}
                            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="محمد"
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            اسم العائلة *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.last_name}
                            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="أحمد"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            رقم الهاتف *
                        </label>
                        <div className="flex gap-2" dir="ltr">
                            <select
                                value={formData.country_code}
                                onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                                className="w-32 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                            >
                                {COUNTRY_CODES.map((cc) => (
                                    <option key={cc.code} value={cc.code}>
                                        {cc.flag} {cc.code}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => {
                                    // Only allow numbers
                                    const value = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, phone: value });
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="5XXXXXXXX"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            ملاحظات
                        </label>
                        <textarea
                            value={formData.details}
                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all resize-none"
                            placeholder="أضف ملاحظات عن جهة الاتصال..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" />
                                {editingContact ? 'جاري التحديث...' : 'جاري الإضافة...'}
                            </>
                        ) : (
                            editingContact ? 'تحديث جهة الاتصال' : 'إضافة جهة الاتصال'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
