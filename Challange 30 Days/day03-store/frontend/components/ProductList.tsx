'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmDialog';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    categories: Category[];
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.data || response.data);
            setError(null);
        } catch (err) {
            setError('فشل في تحميل المنتجات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'حذف المنتج',
            message: 'هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.',
            confirmText: 'نعم، احذف',
            cancelText: 'إلغاء',
        });

        if (!confirmed) return;

        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            showToast('تم حذف المنتج بنجاح', 'success');
        } catch (err) {
            showToast('فشل في حذف المنتج', 'error');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-black mb-4">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black">المنتجات</h1>
                <Link
                    href="/products/create"
                    className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                    + إضافة منتج
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">لا توجد منتجات</p>
                    <Link
                        href="/products/create"
                        className="inline-block mt-4 px-6 py-2 border-2 border-black text-black hover:bg-black hover:text-white transition-colors"
                    >
                        أضف أول منتج
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
