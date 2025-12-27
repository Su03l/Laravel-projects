<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Car extends Model
{
    /** @use HasFactory<\Database\Factories\CarFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'model_year',
        'license_plate',
        'daily_price',
        'status'
    ];

    protected $guarded = [];

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }
}
