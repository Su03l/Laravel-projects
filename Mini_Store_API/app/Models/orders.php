<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class orders extends Model
{
    /** @use HasFactory<\Database\Factories\OrdersFactory> */
    use HasFactory;

    protected $fillable = [
        'order_number',
        'customer_name'
    ];

    public function products()
    {
        return $this->belongsToMany(
            products::class,
            'order_product',
            'order_id',
            'product_id'
        )->withPivot('quantity')->withTimestamps();
    }
}
