<?php

namespace App\Models;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
        'otp_code',
        'otp_verified_at',
        'two_factor_enabled', // 👈 الجديد
        'banned_until',
        'avatar',
        'otp_expires_at'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'role' => UserRole::class,
            'status' => UserStatus::class,
            'otp_verified_at' => 'datetime',
            'two_factor_enabled' => 'boolean', //  الجديد
            'banned_until' => 'datetime',
            'otp_expires_at' => 'datetime',
        ];
    }
}
