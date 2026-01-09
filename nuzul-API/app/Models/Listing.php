<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'city',
        'address', 'price_per_night', 'capacity',
        'amenities', 'image_url'
    ];

    protected $casts = [
        'amenities' => 'array',
        'price_per_night' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
