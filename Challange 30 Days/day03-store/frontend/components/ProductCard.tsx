'use client';

import Link from 'next/link';

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

interface ProductCardProps {
    product: Product;
    onDelete: (id: number) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
    const formatStock = (stock: number) => {
        if (stock === 999999) {
            return 'غير محدود';
        }
        return stock.toString();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR',
        }).format(price);
    };

    return (
        <div className="border-2 border-black bg-white p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="mb-4">
                <h3 className="text-xl font-bold text-black truncate">{product.name}</h3>
            </div>

            {/* Price & Stock */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعر:</span>
                    <span className="text-2xl font-bold text-black">{formatPrice(product.price)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">المخزون:</span>
                    <span className={`font-medium ${product.stock === 999999 ? 'text-gray-500' : 'text-black'}`}>
                        {formatStock(product.stock)}
                        {product.stock === 999999 && (
                            <span className="ml-2 text-xs bg-gray-200 px-2 py-1">رقمي</span>
                        )}
                    </span>
                </div>
            </div>

            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        {product.categories.map(category => (
                            <span
                                key={category.id}
                                className="px-3 py-1 text-sm bg-gray-100 text-black border border-gray-300"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Link
                    href={`/products/${product.id}/edit`}
                    className="flex-1 text-center py-2 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors"
                >
                    تعديل
                </Link>
                <button
                    onClick={() => onDelete(product.id)}
                    className="flex-1 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
                >
                    حذف
                </button>
            </div>
        </div>
    );
}
