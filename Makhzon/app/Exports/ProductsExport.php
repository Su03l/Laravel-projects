<?php

namespace App\Exports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

// عشان نضيف عناوين للأعمدة
use Maatwebsite\Excel\Concerns\WithMapping;


class ProductsExport implements FromCollection, WithHeadings, WithMapping
{
    public function collection()
    {
        return Product::with(['category', 'supplier'])->get();
    }

    public function headings(): array
    {
        return [
            'رقم المنتج',
            'الاسم',
            'القسم',
            'المورد',
            'الباركود (SKU)',
            'سعر الشراء',
            'سعر البيع',
            'الكمية الحالية',
            'حالة المخزون',
        ];
    }

    public function map($product): array
    {
        return [
            $product->id,
            $product->name,
            $product->category?->name ?? 'غير محدد',
            $product->supplier?->name ?? 'غير محدد',
            $product->sku,
            number_format($product->buying_price, 2),
            number_format($product->selling_price, 2),
            $product->stock,

            $product->stock <= $product->min_stock_level ? ' ناقص جداً' : 'ممتاز',
        ];
    }
}
