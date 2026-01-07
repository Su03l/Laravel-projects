<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'description' => $this->description,

            'buying_price' => number_format($this->buying_price, 2),
            'selling_price' => number_format($this->selling_price, 2),

            'stock' => $this->stock,
            'min_stock_level' => $this->min_stock_level,

            'category' => $this->whenLoaded('category', function () {
                return ['id' => $this->category->id, 'name' => $this->category->name];
            }),
            'supplier' => $this->whenLoaded('supplier', function () {
                return ['id' => $this->supplier->id, 'name' => $this->supplier->name];
            }),
        ];
    }
}
