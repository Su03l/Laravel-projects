<?php

namespace App\Models;

use Illuminate\Support\Facades\Storage;
use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'avatar_url',
    ];

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'status',
        'avatar',
        'two_factor_enabled',
        'otp_code',
        'otp_expires_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
            'two_factor_enabled' => 'boolean',
            'otp_expires_at' => 'datetime',
        ];
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) return null;
        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }
        return asset(Storage::url($this->avatar));
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Room::class, 'favorites');
    }
}
