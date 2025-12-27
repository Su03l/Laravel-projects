<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'national_id',
        'phone_number'
    ];

    protected $guarded = [];

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }
}


