'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useToast } from './Toast';

interface Category {
    id: number;
    name: string;
}

interface ProductFormProps {
    productId?: number;
}

export default function ProductForm({ productId }: ProductFormProps) {
    const router = useRouter();
    const { showToast } = useToast();
    const isEditing = !!productId;

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        categories: [] as number[],
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const catResponse = await api.get('/categories');
                setCategories(catResponse.data.data || catResponse.data);

                // Fetch product if editing
                if (productId) {
                    const prodResponse = await api.get(`/products/${productId}`);
                    const product = prodResponse.data.data || prodResponse.data;
                    setFormData({
                        name: product.name,
                        price: product.price.toString(),
                        stock: product.stock.toString(),
                        categories: product.categories?.map((c: Category) => c.id) || [],
                    });
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setFetchingData(false);
            }
        };

        fetchData();
    }, [productId]);

    const handleCategoryToggle = (categoryId: number) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(id => id !== categoryId)
                : [...prev.categories, categoryId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            categories: formData.categories,
        };

        try {
            if (isEditing) {
                await api.put(`/products/${productId}`, payload);
                showToast('تم تحديث المنتج بنجاح', 'success');
            } else {
                await api.post('/products', payload);
                showToast('تم إضافة المنتج بنجاح', 'success');
            }
            router.push('/');
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
            showToast('حدث خطأ أثناء الحفظ', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-8">
                {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        اسم المنتج
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="أدخل اسم المنتج"
                        required
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        السعر (ريال)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="0.00"
                        required
                    />
                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        المخزون
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="الكمية المتاحة"
                        required
                    />
                    <p className="text-gray-500 text-sm mt-1">
                        استخدم 999999 للمنتجات الرقمية (غير محدود)
                    </p>
                    {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
                </div>

                {/* Categories - Multiple Selection */}
                <div>
                    <label className="block text-sm font-medium text-black mb-2">
                        الأقسام (اختر واحد أو أكثر)
                    </label>
                    <div className="border-2 border-black p-4 space-y-2 max-h-60 overflow-y-auto">
                        {categories.length === 0 ? (
                            <p className="text-gray-500">لا توجد أقسام</p>
                        ) : (
                            categories.map(category => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.categories.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="w-5 h-5 accent-black"
                                    />
                                    <span className="text-black">{category.name}</span>
                                </label>
                            ))
                        )}
                    </div>
                    {errors.categories && <p className="text-red-600 text-sm mt-1">{errors.categories}</p>}
                </div>

                {/* Selected Categories Preview */}
                {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {formData.categories.map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            return cat ? (
                                <span
                                    key={catId}
                                    className="px-3 py-1 bg-black text-white text-sm"
                                >
                                    {cat.name}
                                </span>
                            ) : null;
                        })}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                    >
                        {loading ? 'جاري الحفظ...' : (isEditing ? 'تحديث المنتج' : 'إضافة المنتج')}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="flex-1 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
                    >
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
    );
}
