<?php

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'tax_no' => $this->tax_no,
            'products_count' => $this->whenCounted('products'),
            'created_at' => $this->created_at->format('Y-m-d'),
        ];
    }
}
