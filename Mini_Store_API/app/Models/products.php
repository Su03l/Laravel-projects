<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class products extends Model
{
    /** @use HasFactory<\Database\Factories\ProductsFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'stock'
    ];

    public function orders()
    {
        return $this->belongsToMany(
            orders::class,
            'order_product',
            'product_id',
            'order_id'
        )->withPivot('quantity')->withTimestamps();    }
}
