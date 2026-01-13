'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';

interface Category {
    id: number;
    name: string;
    products_count?: number;
}

export default function CategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get('/categories');
            setCategories(response.data.data || response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setSaving(true);
        try {
            await api.post('/categories', { name: newCategoryName });
            setNewCategoryName('');
            fetchCategories();
            showToast('تم إضافة القسم بنجاح', 'success');
        } catch (err) {
            showToast('فشل في إضافة القسم', 'error');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editingName.trim()) return;

        setSaving(true);
        try {
            await api.put(`/categories/${id}`, { name: editingName });
            setEditingId(null);
            setEditingName('');
            fetchCategories();
            showToast('تم تحديث القسم بنجاح', 'success');
        } catch (err) {
            showToast('فشل في تحديث القسم', 'error');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'حذف القسم',
            message: 'هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.',
            confirmText: 'نعم، احذف',
            cancelText: 'إلغاء',
        });

        if (!confirmed) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter(c => c.id !== id));
            showToast('تم حذف القسم بنجاح', 'success');
        } catch (err) {
            showToast('فشل في حذف القسم', 'error');
            console.error(err);
        }
    };

    const startEditing = (category: Category) => {
        setEditingId(category.id);
        setEditingName(category.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">الأقسام</h1>
                <Link
                    href="/"
                    className="px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                >
                    ← العودة للمنتجات
                </Link>
            </div>

            {/* Add New Category Form */}
            <form onSubmit={handleCreate} className="mb-8">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="اسم القسم الجديد"
                        className="flex-1 px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={saving || !newCategoryName.trim()}
                        className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                        {saving ? '...' : '+ إضافة'}
                    </button>
                </div>
            </form>

            {/* Categories List */}
            {categories.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">لا توجد أقسام</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {categories.map(category => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between p-4 border-2 border-black bg-white"
                        >
                            {editingId === category.id ? (
                                <div className="flex-1 flex gap-3">
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="flex-1 px-3 py-2 border-2 border-black focus:outline-none"
                                        autoFocus
                                    />
                                    <button
                                        onClick={() => handleUpdate(category.id)}
                                        disabled={saving}
                                        className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                                    >
                                        حفظ
                                    </button>
                                    <button
                                        onClick={cancelEditing}
                                        className="px-4 py-2 border-2 border-black hover:bg-gray-100 transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <span className="text-lg font-medium text-black">{category.name}</span>
                                        {category.products_count !== undefined && (
                                            <span className="mr-3 text-sm text-gray-500">
                                                ({category.products_count} منتج)
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(category)}
                                            className="px-4 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                                        >
                                            تعديل
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
