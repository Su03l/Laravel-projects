<?php

namespace App\Models;

use App\Enums\RoomStatus;
use App\Enums\RoomType;
use App\Enums\RoomView;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_number',
        'floor',
        'type',
        'view',
        'price_per_night',
        'capacity_adults',
        'capacity_kids',
        'size_sqm',
        'status',
    ];

    protected $appends = ['average_rating'];

    protected function casts(): array
    {
        return [
            'type' => RoomType::class,
            'view' => RoomView::class,
            'status' => RoomStatus::class,
        ];
    }

    // relationship between room and amenity
    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class, 'amenity_room');
    }

    // relationship between room and booking
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(RoomImage::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getAverageRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
    }
}
