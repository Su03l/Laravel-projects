<?php

namespace App\Models;

use App\Enums\PackageType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'price_multiplier',
        'features',
    ];

    protected function casts(): array
    {
        return [
            'type' => PackageType::class,
            'features' => 'array',
        ];
    }

    // relationship between package and booking
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
