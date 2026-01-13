'use client';

import { use } from 'react';
import ProductForm from "@/components/ProductForm";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
    const resolvedParams = use(params);
    const productId = parseInt(resolvedParams.id);

    return <ProductForm productId={productId} />;
}
